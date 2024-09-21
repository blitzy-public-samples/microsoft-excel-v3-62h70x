package com.microsoft.excel.ui.settings

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.preference.PreferenceFragmentCompat
import androidx.lifecycle.ViewModelProvider
import com.microsoft.excel.R
import com.microsoft.excel.databinding.ActivitySettingsBinding
import com.microsoft.excel.ui.settings.viewmodels.SettingsViewModel

class SettingsActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySettingsBinding
    private lateinit var viewModel: SettingsViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize view binding
        binding = ActivitySettingsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialize the ViewModel
        viewModel = ViewModelProvider(this).get(SettingsViewModel::class.java)

        // Set up the toolbar
        setupToolbar()

        // Load the SettingsFragment into the container
        if (savedInstanceState == null) {
            supportFragmentManager
                .beginTransaction()
                .replace(R.id.settings_container, SettingsFragment())
                .commit()
        }

        // Set up observers for ViewModel LiveData
        setupObservers()
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.apply {
            setTitle(R.string.settings_title)
            setDisplayHomeAsUpEnabled(true)
            setDisplayShowHomeEnabled(true)
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return true
    }

    private fun setupObservers() {
        // Observe ViewModel LiveData and update UI accordingly
        viewModel.settingsUpdated.observe(this) { updated ->
            if (updated) {
                // Handle settings update, e.g., show a confirmation message
            }
        }
    }
}

class SettingsFragment : PreferenceFragmentCompat() {

    private lateinit var viewModel: SettingsViewModel

    override fun onCreatePreferences(savedInstanceState: Bundle?, rootKey: String?) {
        setPreferencesFromResource(R.xml.preferences, rootKey)
        
        viewModel = ViewModelProvider(requireActivity()).get(SettingsViewModel::class.java)

        // Set up preference change listeners
        setupPreferenceListeners()
    }

    private fun setupPreferenceListeners() {
        // Example: Listen for theme preference changes
        findPreference<androidx.preference.ListPreference>("theme_preference")?.setOnPreferenceChangeListener { _, newValue ->
            viewModel.updateTheme(newValue as String)
            true
        }

        // Add more preference listeners here
    }

    override fun onPreferenceChange(preference: androidx.preference.Preference, newValue: Any): Boolean {
        when (preference.key) {
            "theme_preference" -> {
                viewModel.updateTheme(newValue as String)
                // Update UI to reflect the change if necessary
            }
            // Handle other preferences here
        }
        return true
    }
}