from __future__ import annotations

from datetime import datetime
from typing import Annotated, Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy import func, select, case
from sqlalchemy.orm import Session

from app.core.auth import require_role
from app.db.database import get_db
from app.db.models import ActivityEvent, Emission, Facility, User
from app.services.analytics.queries import kpis as kpis_query, last_event_time
from app.utils.time import parse_dt

router = APIRouter(prefix="/v1/analytics", tags=["analytics"])


class KPIsOut(BaseModel):
    total_co2e_kg: float
    scope1_kg: float
    scope2_kg: float
    scope3_kg: float


@router.get("/kpis", response_model=KPIsOut)
def kpis(db: Session = Depends(get_db), user: Annotated[User, Depends(require_role("viewer", "analyst", "admin"))] = None, from_: str = Query(alias="from"), to: str = Query()):
    start = parse_dt(from_)
    end = parse_dt(to)
    if end <= start:
        raise HTTPException(status_code=400, detail="to must be after from")
    data = kpis_query(db, org_id=user.org_id, date_from=start, date_to=end)
    return KPIsOut(**data)


class TrendPoint(BaseModel):
    period: str
    co2e_kg: float


@router.get("/trend", response_model=list[TrendPoint])
def trend(
    db: Session = Depends(get_db),
    user: Annotated[User, Depends(require_role("viewer", "analyst", "admin"))] = None,
    grain: Literal["day", "month"] = Query(default="day"),
    from_: str = Query(alias="from"),
    to: str = Query(),
):
    start = parse_dt(from_)
    end = parse_dt(to)
    if end <= start:
        raise HTTPException(status_code=400, detail="to must be after from")

    # Group emissions by event.occurred_at truncated to day/month
    trunc_func = func.date_trunc("day", ActivityEvent.occurred_at) if grain == "day" else func.date_trunc("month", ActivityEvent.occurred_at)
    stmt = (
        select(trunc_func.label("period"), func.coalesce(func.sum(Emission.co2e_kg), 0))
        .select_from(Emission)
        .join(ActivityEvent, ActivityEvent.id == Emission.event_id)
        .where(Emission.org_id == user.org_id)
        .where(ActivityEvent.occurred_at >= start)
        .where(ActivityEvent.occurred_at < end)
        .group_by("period")
        .order_by("period")
    )
    rows = list(db.execute(stmt))
    return [TrendPoint(period=r[0].date().isoformat() if grain == "day" else r[0].date().replace(day=1).isoformat(), co2e_kg=float(r[1] or 0)) for r in rows]


class SummaryOut(BaseModel):
    total_co2e_kg: float
    scope1_kg: float
    scope2_kg: float
    scope3_kg: float
    facilities_count: int
    last_event_at: Optional[datetime]
    top_categories: list[tuple[str, float]]


@router.get("/summary")
def summary(id: int = Query(..., description="Organization ID"), db: Session = Depends(get_db), user: Annotated[User, Depends(require_role("viewer", "analyst", "admin"))] = None):
    org_id = id
    
    totals_stmt = select(
        func.coalesce(func.sum(Emission.co2e_kg), 0),
        func.coalesce(func.sum(case((Emission.scope == "1", Emission.co2e_kg), else_=0)), 0),
        func.coalesce(func.sum(case((Emission.scope == "2", Emission.co2e_kg), else_=0)), 0),
        func.coalesce(func.sum(case((Emission.scope == "3", Emission.co2e_kg), else_=0)), 0),
    ).where(Emission.org_id == org_id)
    total, s1, s2, s3 = db.execute(totals_stmt).one()

    facilities_count = db.scalar(select(func.count()).select_from(Facility).where(Facility.org_id == org_id))
    last_ev = last_event_time(db, org_id=org_id)

    top_stmt = (
        select(ActivityEvent.category, func.coalesce(func.sum(Emission.co2e_kg), 0))
        .join(ActivityEvent, ActivityEvent.id == Emission.event_id)
        .where(Emission.org_id == org_id)
        .group_by(ActivityEvent.category)
        .order_by(func.coalesce(func.sum(Emission.co2e_kg), 0).desc())
        .limit(5)
    )
    top = [(r[0], float(r[1] or 0)) for r in db.execute(top_stmt)]

    summary_dict = {
        "id": org_id,
        "total_co2e_kg": float(total or 0),
        "scope1_kg": float(s1 or 0),
        "scope2_kg": float(s2 or 0),
        "scope3_kg": float(s3 or 0),
        "facilities_count": int(facilities_count or 0),
        "last_event_at": last_ev.isoformat() if last_ev else None,
        "top_categories": [{"category": cat, "co2e_kg": kg} for cat, kg in top],
    }
    
    return summary_dict
