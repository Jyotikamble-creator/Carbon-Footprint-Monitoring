package com.nutrino.carbonfootprint.presentation.state

import com.nutrino.carbonfootprint.data.remote.analytics.SuggestionResponse

sealed class SuggestionUIState {
    object Idle : SuggestionUIState()
    object Loading : SuggestionUIState()
    data class Success(val data: SuggestionResponse? = null) : SuggestionUIState()
    data class Error(val error: String) : SuggestionUIState()
}

