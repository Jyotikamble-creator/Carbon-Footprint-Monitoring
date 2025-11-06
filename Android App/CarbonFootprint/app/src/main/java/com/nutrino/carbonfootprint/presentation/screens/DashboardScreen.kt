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
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "Carbon Footprint Dashboard",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
        }

        // AI Suggestions Card
        navController?.let {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer
                    ),
                    onClick = {
                        navController.navigate(SUGGESTION_SCREEN)
                    }
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Lightbulb,
                                contentDescription = "AI Suggestions",
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(32.dp)
                            )
                            Column {
                                Text(
                                    text = "AI-Powered Suggestions",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer
                                )
                                Text(
                                    text = "Get personalized recommendations",
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
                                )
                            }
                        }
                        Icon(
                            imageVector = Icons.Default.ArrowForward,
                            contentDescription = "View",
                            tint = MaterialTheme.colorScheme.primary
                        )
                    }
                }
            }
        }

        // KPIs Section
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = "Emissions Overview (Last 30 Days)",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )

                    when (kpisState) {
                        is KpisUIState.Loading -> {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(200.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator()
                            }
                        }
                        is KpisUIState.Success -> {
                            (kpisState as KpisUIState.Success).data?.let { kpis ->
                                Column(
                                    verticalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    MetricCard(
                                        title = "Total CO₂e",
                                        value = "${String.format("%.2f", kpis.total_co2e_kg)} kg",
                                        color = MaterialTheme.colorScheme.primary
                                    )
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        MetricCard(
                                            title = "Scope 1",
                                            value = "${String.format("%.2f", kpis.scope1_kg)} kg",
                                            color = MaterialTheme.colorScheme.secondary,
                                            modifier = Modifier.weight(1f)
                                        )
                                        MetricCard(
                                            title = "Scope 2",
                                            value = "${String.format("%.2f", kpis.scope2_kg)} kg",
                                            color = MaterialTheme.colorScheme.tertiary,
                                            modifier = Modifier.weight(1f)
                                        )
                                        MetricCard(
                                            title = "Scope 3",
                                            value = "${String.format("%.2f", kpis.scope3_kg)} kg",
                                            color = MaterialTheme.colorScheme.error,
                                            modifier = Modifier.weight(1f)
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
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = "Organization Summary",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(bottom = 16.dp)
                    )

                    when (summaryState) {
                        is SummaryUIState.Loading -> {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(150.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                CircularProgressIndicator()
                            }
                        }
                        is SummaryUIState.Success -> {
                            (summaryState as SummaryUIState.Success).data?.let { summary ->
                                Column(
                                    verticalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Text("Total Facilities: ${summary.facilities_count}")
                                    Text("Last Event: ${summary.last_event_at ?: "No events"}")

                                    if (summary.topCategories.isNotEmpty()) {
                                        Text(
                                            text = "Top Categories:",
                                            fontWeight = FontWeight.Medium,
                                            modifier = Modifier.padding(top = 8.dp)
                                        )
                                        summary.topCategories.take(5).forEach { categoryArray ->
                                            if (categoryArray.size >= 2) {
                                                Row(
                                                    modifier = Modifier.fillMaxWidth(),
                                                    horizontalArrangement = Arrangement.SpaceBetween
                                                ) {
                                                    Text(categoryArray[0]) // category name
                                                    Text("${String.format("%.2f", categoryArray[1].toDoubleOrNull() ?: 0.0)} kg") // category value
                                                }
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
    color: androidx.compose.ui.graphics.Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.1f))
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = title,
                fontSize = 12.sp,
                color = color
            )
            Text(
                text = value,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = color
            )
        }
    }
}
