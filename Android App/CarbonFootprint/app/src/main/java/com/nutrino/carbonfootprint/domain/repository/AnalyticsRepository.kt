package com.nutrino.carbonfootprint.domain.repository

import com.nutrino.carbonfootprint.data.remote.analytics.KpisResponse
import com.nutrino.carbonfootprint.data.remote.analytics.SuggestionResponse
import com.nutrino.carbonfootprint.data.remote.analytics.SummaryResponse
import com.nutrino.carbonfootprint.data.remote.analytics.TrendResponse
import com.nutrino.carbonfootprint.data.state.ResultState
import kotlinx.coroutines.flow.Flow

interface AnalyticsRepository {
    suspend fun getKpis(
        from: String? = null,
        to: String? = null
    ): Flow<ResultState<KpisResponse>>

    suspend fun getTrend(
        from: String? = null,
        to: String? = null,
        grain: String? = null
    ): Flow<ResultState<TrendResponse>>

    suspend fun getSummary(): Flow<ResultState<SummaryResponse>>

    suspend fun getSuggestion(
        id: Int,
        userId: Int
    ): Flow<ResultState<SuggestionResponse>>
}
