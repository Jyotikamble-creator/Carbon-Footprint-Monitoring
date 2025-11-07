package com.nutrino.carbonfootprint.presentation.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.ui.unit.dp
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

    Box(modifier = Modifier.fillMaxSize()) {
        NavHost(
            navController = bottomNavController,
            startDestination = DASHBOARD_SCREEN,
            modifier = Modifier.fillMaxSize()
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

        BottomNavigationBar(
            navController = bottomNavController,
            modifier = Modifier.align(androidx.compose.ui.Alignment.BottomCenter)
        )
    }
}

@Composable
private fun BottomNavigationBar(
    navController: NavController,
    modifier: Modifier = Modifier
) {
    val currentBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = currentBackStackEntry?.destination?.route

    NavigationBar(
        modifier = modifier,
        containerColor = MaterialTheme.colorScheme.surface,
        contentColor = MaterialTheme.colorScheme.onSurface,
        tonalElevation = 8.dp,
        windowInsets = WindowInsets(0, 0, 0, 0)
    ) {
        NavigationBarItem(
            icon = {
                Icon(
                    Icons.Default.Home,
                    contentDescription = "Dashboard",
                    tint = if (currentRoute?.contains("DASHBOARD_SCREEN") == true)
                        MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )
            },
            label = {
                Text(
                    "Dashboard",
                    color = if (currentRoute?.contains("DASHBOARD_SCREEN") == true)
                        MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )
            },
            selected = currentRoute?.contains("DASHBOARD_SCREEN") == true,
            onClick = {
                navController.navigate(DASHBOARD_SCREEN) {
                    popUpTo(navController.graph.startDestinationId) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = MaterialTheme.colorScheme.primary,
                selectedTextColor = MaterialTheme.colorScheme.primary,
                indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
            )
        )

        NavigationBarItem(
            icon = {
                Icon(
                    Icons.Default.Add,
                    contentDescription = "Data Ingestion",
                    tint = if (currentRoute?.contains("DATA_INGESTION_SCREEN") == true)
                        MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )
            },
            label = {
                Text(
                    "Ingestion",
                    color = if (currentRoute?.contains("DATA_INGESTION_SCREEN") == true)
                        MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )
            },
            selected = currentRoute?.contains("DATA_INGESTION_SCREEN") == true,
            onClick = {
                navController.navigate(DATA_INGESTION_SCREEN) {
                    popUpTo(navController.graph.startDestinationId) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = MaterialTheme.colorScheme.primary,
                selectedTextColor = MaterialTheme.colorScheme.primary,
                indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
            )
        )

        NavigationBarItem(
            icon = {
                Icon(
                    Icons.Default.LocationOn,
                    contentDescription = "Facilities",
                    tint = if (currentRoute?.contains("FACILITIES_SCREEN") == true)
                        MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )
            },
            label = {
                Text(
                    "Facilities",
                    color = if (currentRoute?.contains("FACILITIES_SCREEN") == true)
                        MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )
            },
            selected = currentRoute?.contains("FACILITIES_SCREEN") == true,
            onClick = {
                navController.navigate(FACILITIES_SCREEN) {
                    popUpTo(navController.graph.startDestinationId) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = MaterialTheme.colorScheme.primary,
                selectedTextColor = MaterialTheme.colorScheme.primary,
                indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
            )
        )


        NavigationBarItem(
            icon = {
                Icon(
                    Icons.Default.Person,
                    contentDescription = "Profile",
                    tint = if (currentRoute?.contains("PROFILE_SCREEN") == true)
                        MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )
            },
            label = {
                Text(
                    "Profile",
                    color = if (currentRoute?.contains("PROFILE_SCREEN") == true)
                        MaterialTheme.colorScheme.primary
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )
            },
            selected = currentRoute?.contains("PROFILE_SCREEN") == true,
            onClick = {
                navController.navigate(PROFILE_SCREEN) {
                    popUpTo(navController.graph.startDestinationId) {
                        saveState = true
                    }
                    launchSingleTop = true
                    restoreState = true
                }
            },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = MaterialTheme.colorScheme.primary,
                selectedTextColor = MaterialTheme.colorScheme.primary,
                indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
            )
        )
    }
}