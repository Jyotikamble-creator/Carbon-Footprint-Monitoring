package com.nutrino.carbonfootprint.presentation.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Lightbulb
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.nutrino.carbonfootprint.presentation.navigation.SUGGESTION_SCREEN
import com.nutrino.carbonfootprint.presentation.state.KpisUIState
import com.nutrino.carbonfootprint.presentation.state.SummaryUIState
import com.nutrino.carbonfootprint.presentation.viewmodels.AnalyticsViewmodel
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    navController: NavController? = null,
    analyticsViewmodel: AnalyticsViewmodel = hiltViewModel()
) {
    val kpisState by analyticsViewmodel.kpisState.collectAsStateWithLifecycle()
    val summaryState by analyticsViewmodel.summaryState.collectAsStateWithLifecycle()

    // Load data when screen loads
    LaunchedEffect(Unit) {
        val now = LocalDateTime.now()
        val thirtyDaysAgo = now.minusDays(30)
        val formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME

        analyticsViewmodel.getKpis(
            from = thirtyDaysAgo.format(formatter),
            to = now.format(formatter)
        )
        analyticsViewmodel.getSummary()
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.spacedBy(20.dp),
        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 20.dp, bottom = 80.dp)
    ) {
        // Header
        item {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.Start,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text(
                    text = "🌱 Carbon Footprint",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = "Monitor and reduce your environmental impact",
                    fontSize = 15.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                    fontWeight = FontWeight.Normal
                )
            }
        }

        // AI Suggestions Card
        navController?.let {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primary
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(20.dp),
                    onClick = {
                        navController.navigate(SUGGESTION_SCREEN)
                    }
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Lightbulb,
                                contentDescription = "AI Suggestions",
                                tint = Color.White,
                                modifier = Modifier.size(32.dp)
                            )
                            Column {
                                Text(
                                    text = "🤖 AI-Powered Insights",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 18.sp,
                                    color = Color.White
                                )
                                Text(
                                    text = "Get personalized sustainability tips",
                                    fontSize = 13.sp,
                                    color = Color.White.copy(alpha = 0.9f)
                                )
                            }
                        }
                        Icon(
                            imageVector = Icons.Default.ArrowForward,
                            contentDescription = "View",
                            tint = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }
            }
        }

        // KPIs Section
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.12f))
            ) {
                Column(
                    modifier = Modifier.padding(24.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.padding(bottom = 20.dp)
                    ) {
                        Text(
                            text = "📊",
                            fontSize = 28.sp
                        )
                        Text(
                            text = "Emissions Overview (Last 30 Days)",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }

                    when (kpisState) {
                        is KpisUIState.Loading -> {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(200.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator(
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        }
                        is KpisUIState.Success -> {
                            (kpisState as KpisUIState.Success).data?.let { kpis ->
                                Column(
                                    verticalArrangement = Arrangement.spacedBy(16.dp)
                                ) {
                                    MetricCard(
                                        title = "Total CO₂e",
                                        value = "${String.format("%.2f", kpis.total_co2e_kg)} kg",
                                        color = MaterialTheme.colorScheme.primary,
                                        icon = "🌍",
                                        modifier = Modifier.fillMaxWidth()
                                    )
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        MetricCard(
                                            title = "Scope 1",
                                            value = "${String.format("%.2f", kpis.scope1_kg)} kg",
                                            color = com.nutrino.carbonfootprint.ui.theme.Scope1Color,
                                            modifier = Modifier.weight(1f),
                                            icon = "🔥"
                                        )
                                        MetricCard(
                                            title = "Scope 2",
                                            value = "${String.format("%.2f", kpis.scope2_kg)} kg",
                                            color = com.nutrino.carbonfootprint.ui.theme.Scope2Color,
                                            modifier = Modifier.weight(1f),
                                            icon = "⚡"
                                        )
                                        MetricCard(
                                            title = "Scope 3",
                                            value = "${String.format("%.2f", kpis.scope3_kg)} kg",
                                            color = com.nutrino.carbonfootprint.ui.theme.Scope3Color,
                                            modifier = Modifier.weight(1f),
                                            icon = "✈️"
                                        )
                                    }
                                }
                            }
                        }
                        is KpisUIState.Error -> {
                            Text(
                                text = "Error loading KPIs: ${(kpisState as KpisUIState.Error).error}",
                                color = MaterialTheme.colorScheme.error
                            )
                        }
                        is KpisUIState.Idle -> {
                            Text("Loading KPIs...")
                        }
                    }
                }
            }
        }

        // Summary Section
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.12f))
            ) {
                Column(
                    modifier = Modifier.padding(24.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                        modifier = Modifier.padding(bottom = 20.dp)
                    ) {
                        Text(
                            text = "🏢",
                            fontSize = 28.sp
                        )
                        Text(
                            text = "Organization Summary",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }

                    when (summaryState) {
                        is SummaryUIState.Loading -> {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(150.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator(
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        }
                        is SummaryUIState.Success -> {
                            (summaryState as SummaryUIState.Success).data?.let { summary ->
                                Column(
                                    verticalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    SummaryRow("Total Facilities", "${summary.facilities_count}")
                                    SummaryRow("Last Event", summary.last_event_at ?: "No events")

                                    if (summary.topCategories.isNotEmpty()) {
                                        Text(
                                            text = "Top Categories:",
                                            fontWeight = FontWeight.SemiBold,
                                            fontSize = 16.sp,
                                            color = MaterialTheme.colorScheme.onSurface,
                                            modifier = Modifier.padding(top = 12.dp, bottom = 8.dp)
                                        )
                                        summary.topCategories.take(5).forEach { categoryArray ->
                                            if (categoryArray.size >= 2) {
                                                CategoryRow(
                                                    categoryName = categoryArray[0],
                                                    value = "${String.format("%.2f", categoryArray[1].toDoubleOrNull() ?: 0.0)} kg"
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        is SummaryUIState.Error -> {
                            Text(
                                text = "Error loading summary: ${(summaryState as SummaryUIState.Error).error}",
                                color = MaterialTheme.colorScheme.error
                            )
                        }
                        is SummaryUIState.Idle -> {
                            Text("Loading summary...")
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MetricCard(
    title: String,
    value: String,
    color: Color,
    modifier: Modifier = Modifier,
    icon: String = ""
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = color.copy(alpha = 0.15f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.5.dp, color.copy(alpha = 0.3f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalAlignment = Alignment.Start,
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = title,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )
                if (icon.isNotEmpty()) {
                    Text(
                        text = icon,
                        fontSize = 18.sp
                    )
                }
            }
            Text(
                text = value,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = color,
                maxLines = 2
            )
        }
    }
}

@Composable
fun SummaryRow(
    label: String,
    value: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
        )
        Text(
            text = value,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onSurface
        )
    }
}

@Composable
fun CategoryRow(
    categoryName: String,
    value: String
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)
        ),
        shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = categoryName,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = value,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}
