package com.microsoft.excel.ui.workbook

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.ViewModelProvider
import androidx.viewpager2.widget.ViewPager2
import com.google.android.material.tabs.TabLayoutMediator
import com.microsoft.excel.R
import com.microsoft.excel.databinding.ActivityWorkbookBinding
import com.microsoft.excel.ui.workbook.adapters.WorksheetPagerAdapter
import com.microsoft.excel.ui.workbook.viewmodels.WorkbookViewModel
import com.microsoft.excel.core.models.Workbook

class WorkbookActivity : AppCompatActivity() {

    private lateinit var binding: ActivityWorkbookBinding
    private lateinit var viewModel: WorkbookViewModel
    private lateinit var worksheetPagerAdapter: WorksheetPagerAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize view binding
        binding = ActivityWorkbookBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Get the workbook ID from the intent extras
        val workbookId = intent.getStringExtra("WORKBOOK_ID") ?: throw IllegalArgumentException("Workbook ID must be provided")

        // Initialize the ViewModel with the workbook ID
        viewModel = ViewModelProvider(this, WorkbookViewModel.Factory(workbookId))
            .get(WorkbookViewModel::class.java)

        setupViewPager()
        setupToolbar()
        setupFormulaBar()

        // Observe ViewModel LiveData and update UI accordingly
        viewModel.workbook.observe(this) { workbook ->
            updateUI(workbook)
        }
    }

    private fun setupViewPager() {
        worksheetPagerAdapter = WorksheetPagerAdapter(this)
        binding.viewPager.adapter = worksheetPagerAdapter

        TabLayoutMediator(binding.tabLayout, binding.viewPager) { tab, position ->
            tab.text = viewModel.getWorksheetName(position)
        }.attach()

        binding.viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                viewModel.setSelectedWorksheet(position)
            }
        })
    }

    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        
        viewModel.workbook.observe(this) { workbook ->
            supportActionBar?.title = workbook.name
        }

        binding.toolbar.setOnMenuItemClickListener { menuItem ->
            when (menuItem.itemId) {
                R.id.action_save -> {
                    saveWorkbook()
                    true
                }
                R.id.action_share -> {
                    shareWorkbook()
                    true
                }
                else -> false
            }
        }
    }

    private fun setupFormulaBar() {
        binding.formulaBar.addTextChangedListener { text ->
            viewModel.updateCellFormula(text.toString())
        }

        viewModel.selectedCell.observe(this) { cell ->
            binding.formulaBar.setText(cell.formula)
        }
    }

    private fun addNewWorksheet() {
        // TODO: Implement dialog to get new worksheet name
        val newWorksheetName = "New Worksheet"
        viewModel.addWorksheet(newWorksheetName)
        worksheetPagerAdapter.notifyDataSetChanged()
        binding.viewPager.setCurrentItem(worksheetPagerAdapter.itemCount - 1, true)
    }

    private fun saveWorkbook() {
        // TODO: Implement progress dialog
        viewModel.saveWorkbook().observe(this) { result ->
            if (result.isSuccess) {
                // TODO: Show success message
            } else {
                // TODO: Show error message
            }
        }
    }

    private fun shareWorkbook() {
        viewModel.getShareableLink().observe(this) { link ->
            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                type = "text/plain"
                putExtra(Intent.EXTRA_TEXT, link)
            }
            startActivity(Intent.createChooser(shareIntent, "Share Workbook"))
        }
    }

    private fun updateUI(workbook: Workbook) {
        worksheetPagerAdapter.setWorksheets(workbook.worksheets)
        // TODO: Update other UI elements based on workbook data
    }
}