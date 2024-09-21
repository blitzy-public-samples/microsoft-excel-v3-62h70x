package com.microsoft.excel

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.NavigationUI
import com.microsoft.excel.R
import com.microsoft.excel.databinding.ActivityMainBinding
import com.microsoft.excel.core.ExcelApplication

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var navController: NavController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize view binding
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Set up the NavController
        val navHostFragment = supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController

        // Set up the bottom navigation view with the NavController
        NavigationUI.setupWithNavController(binding.bottomNavView, navController)

        // Initialize ExcelApplication
        (application as ExcelApplication).initialize()

        // Set up any necessary observers or event listeners
        setupObservers()
    }

    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp() || super.onSupportNavigateUp()
    }

    private fun setupObservers() {
        // TODO: Set up any necessary observers or event listeners
    }

    // TODO: Implement deep linking functionality
    // TODO: Add support for handling intent filters for Excel file types
    // TODO: Implement runtime permissions handling
    // TODO: Add crash reporting and analytics initialization
    // TODO: Implement any necessary Android-specific lifecycle handling
    // TODO: Set up dark mode support and theme switching
    // TODO: Implement any necessary background services or work managers for syncing data
}