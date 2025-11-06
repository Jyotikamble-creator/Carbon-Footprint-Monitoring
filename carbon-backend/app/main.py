from fastapi import FastAPI
from dotenv import load_dotenv
load_dotenv()
from fastapi.middleware.cors import CORSMiddleware
import socket
from app.core.middleware import request_context_middleware
from app.api.v1.auth import router as auth_router
from app.api.v1.tenants import router as tenants_router
from app.api.v1.ingest import router as ingest_router
from app.api.v1.ingest_upload import router as ingest_upload_router
from app.api.v1.factors import router as factors_router
from app.api.v1.emissions import router as emissions_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.reports import router as reports_router

app = FastAPI(title="Carbon Footprint Monitoring API", version="0.1.0")

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.middleware("http")(request_context_middleware)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(auth_router)
app.include_router(tenants_router)
app.include_router(ingest_router)
app.include_router(ingest_upload_router)
app.include_router(factors_router)
app.include_router(emissions_router)
app.include_router(analytics_router)
app.include_router(reports_router)


def get_ip_address() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        try:
            s.close()
        except Exception:
            pass
    return ip


if __name__ == "__main__":
    import uvicorn
    host_ip = "0.0.0.0"
    port = 5000
    print("\n" + "=" * 50)
    print("Server is running on:")
    print(f"Local URL:     http://localhost:{port}")
    print(f"Network URL:   http://{get_ip_address()}:{port}")
    print(f"API Docs URL:  http://{get_ip_address()}:{port}/docs")
    print("=" * 50 + "\n")
    uvicorn.run(app, host=host_ip, port=port)