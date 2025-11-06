package com.nutrino.carbonfootprint.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.nutrino.carbonfootprint.presentation.screens.OverViewScreen
import com.nutrino.carbonfootprint.presentation.screens.SignInScreen
import com.nutrino.carbonfootprint.presentation.screens.SignUpScreen
import com.nutrino.carbonfootprint.presentation.screens.SuggestionScreen
import com.nutrino.carbonfootprint.presentation.viewmodels.UserPreferenceViewModel

@Composable
fun MainApp(userPreferenceViewModel: UserPreferenceViewModel = hiltViewModel()) {
    val navController = rememberNavController()
    val isInitialized = userPreferenceViewModel.isInitialized.collectAsStateWithLifecycle()
    val isLoggedIn = userPreferenceViewModel.isLoggedIn.collectAsStateWithLifecycle()

    NavHost(
        navController = navController,
        startDestination = SIGN_IN_SCREEN
    ) {
        composable<SIGN_UP_SCREEN> {
            SignUpScreen(
                onSignUpSuccess = {
                    navController.navigate(OVER_VIEW_SCREEN) {
                        popUpTo(SIGN_UP_SCREEN) { inclusive = true }
                    }
                },
                onNavigateToLogin = {
                    navController.navigate(SIGN_IN_SCREEN)
                },
                onNavigateToHome = {
                    navController.navigate(OVER_VIEW_SCREEN) {
                        popUpTo(SIGN_UP_SCREEN) { inclusive = true }
                    }
                }
            )
        }

        composable<SIGN_IN_SCREEN> {
            SignInScreen(
                onSignInSuccess = {
                    navController.navigate(OVER_VIEW_SCREEN) {
                        popUpTo(SIGN_IN_SCREEN) { inclusive = true }
                    }
                },
                onNavigateToSignUp = {
                    navController.navigate(SIGN_UP_SCREEN)
                },
                onNavigateToHome = {
                    navController.navigate(OVER_VIEW_SCREEN) {
                        popUpTo(SIGN_IN_SCREEN) { inclusive = true }
                    }
                }
            )
        }

        composable<OVER_VIEW_SCREEN> {
            OverViewScreen(navController = navController)

        composable<SUGGESTION_SCREEN> {
            SuggestionScreen(navController = navController)
        }
        }
    }

}