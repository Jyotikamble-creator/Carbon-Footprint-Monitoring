package com.nutrino.carbonfootprint.data.remote.analytics

import kotlinx.serialization.Serializable

@Serializable
data class SuggestionResponse(
    val message: String = ""
)

