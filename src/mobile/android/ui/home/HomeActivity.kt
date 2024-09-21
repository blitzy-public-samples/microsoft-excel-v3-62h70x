package com.microsoft.excel.ui.home

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import com.microsoft.excel.R
import com.microsoft.excel.databinding.ActivityHomeBinding
import com.microsoft.excel.ui.home.adapters.RecentWorkbooksAdapter
import com.microsoft.excel.ui.home.adapters.TemplatesAdapter
import com.microsoft.excel.ui.home.viewmodels.HomeViewModel
import com.microsoft.excel.ui.workbook.WorkbookActivity
import android.content.Intent
import android.text.Editable
import android.text.TextWatcher

class HomeActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHomeBinding
    private lateinit var viewModel: HomeViewModel
    private lateinit var recentWorkbooksAdapter: RecentWorkbooksAdapter
    private lateinit var templatesAdapter: TemplatesAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        viewModel = ViewModelProvider(this).get(HomeViewModel::class.java)

        setupRecentWorkbooksRecyclerView()
        setupTemplatesRecyclerView()
        setupSearch()

        binding.btnCreateNewWorkbook.setOnClickListener {
            createNewWorkbook()
        }

        observeViewModel()
    }

    private fun setupRecentWorkbooksRecyclerView() {
        recentWorkbooksAdapter = RecentWorkbooksAdapter { workbookId ->
            openWorkbook(workbookId)
        }
        binding.rvRecentWorkbooks.apply {
            layoutManager = LinearLayoutManager(this@HomeActivity)
            adapter = recentWorkbooksAdapter
        }
    }

    private fun setupTemplatesRecyclerView() {
        templatesAdapter = TemplatesAdapter { templateId ->
            viewModel.createWorkbookFromTemplate(templateId)
        }
        binding.rvTemplates.apply {
            layoutManager = LinearLayoutManager(this@HomeActivity, LinearLayoutManager.HORIZONTAL, false)
            adapter = templatesAdapter
        }
    }

    private fun setupSearch() {
        binding.etSearch.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                viewModel.searchWorkbooks(s.toString())
            }

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })
    }

    private fun createNewWorkbook() {
        viewModel.createNewWorkbook().observe(this) { newWorkbookId ->
            openWorkbook(newWorkbookId)
        }
    }

    private fun openWorkbook(workbookId: String) {
        val intent = Intent(this, WorkbookActivity::class.java).apply {
            putExtra("WORKBOOK_ID", workbookId)
        }
        startActivity(intent)
    }

    private fun observeViewModel() {
        viewModel.recentWorkbooks.observe(this) { workbooks ->
            recentWorkbooksAdapter.submitList(workbooks)
        }

        viewModel.templates.observe(this) { templates ->
            templatesAdapter.submitList(templates)
        }

        viewModel.error.observe(this) { errorMessage ->
            // TODO: Display error message to user
        }
    }
}