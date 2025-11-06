package com.nutrino.carbonfootprint.presentation.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.nutrino.carbonfootprint.presentation.navigation.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OverViewScreen(navController: NavController) {
    val bottomNavController = rememberNavController()

    Scaffold(
        bottomBar = {
            BottomNavigationBar(navController = bottomNavController)
        }
    ) { innerPadding ->
        NavHost(
            navController = bottomNavController,
            startDestination = DASHBOARD_SCREEN,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable<DASHBOARD_SCREEN> {
                DashboardScreen(navController = bottomNavController)
            }

            composable<DATA_INGESTION_SCREEN> {
                DataIngestionScreen()
            }

            composable<FACILITIES_SCREEN> {
                FacilitiesScreen()
            }

            composable<ANALYTICS_SCREEN> {
                DashboardScreen(navController = bottomNavController) // Reuse dashboard for now
            }

            composable<PROFILE_SCREEN> {
                ProfileScreen(
                    onLogout = {
                        navController.navigate(SIGN_UP_SCREEN) {
                            popUpTo(OVER_VIEW_SCREEN) { inclusive = true }
                        }
                    }
                )
            }

            composable<SUGGESTION_SCREEN> {
                SuggestionScreen(navController = bottomNavController)
            }
        }
    }
}

@Composable
private fun BottomNavigationBar(navController: NavController) {
    val currentBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = currentBackStackEntry?.destination?.route

    NavigationBar {
        NavigationBarItem(
            icon = { Icon(Icons.Default.Home, contentDescription = "Dashboard") },
            label = { Text("Dashboard") },
            selected = currentRoute?.contains("DASHBOARD_SCREEN") == true,
            onClick = {
                navController.navigate(DASHBOARD_SCREEN) {
                    popUpTo(navController.graph.startDestinationId) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            }
        )

        NavigationBarItem(
            icon = { Icon(Icons.Default.Add, contentDescription = "Data Ingestion") },
            label = { Text("Ingestion") },
            selected = currentRoute?.contains("DATA_INGESTION_SCREEN") == true,
            onClick = {
                navController.navigate(DATA_INGESTION_SCREEN) {
                    popUpTo(navController.graph.startDestinationId) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            }
        )

        NavigationBarItem(
            icon = { Icon(Icons.Default.LocationOn, contentDescription = "Facilities") },
            label = { Text("Facilities") },
            selected = currentRoute?.contains("FACILITIES_SCREEN") == true,
            onClick = {
                navController.navigate(FACILITIES_SCREEN) {
                    popUpTo(navController.graph.startDestinationId) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            }
        )

        NavigationBarItem(
            icon = { Icon(Icons.Default.Analytics, contentDescription = "Analytics") },
            label = { Text("Analytics") },
            selected = currentRoute?.contains("ANALYTICS_SCREEN") == true,
            onClick = {
                navController.navigate(ANALYTICS_SCREEN) {
                    popUpTo(navController.graph.startDestinationId) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            }
        )

        NavigationBarItem(
            icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
            label = { Text("Profile") },
            selected = currentRoute?.contains("PROFILE_SCREEN") == true,
            onClick = {
                navController.navigate(PROFILE_SCREEN) {
                    popUpTo(navController.graph.startDestinationId) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            }
        )
    }
}