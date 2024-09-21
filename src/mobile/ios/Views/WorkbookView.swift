import SwiftUI
import ExcelCore
import Combine

struct WorkbookView: View {
    @StateObject private var viewModel: WorkbookViewModel
    @State private var selectedWorksheetIndex: Int = 0
    @State private var isAddWorksheetPresented: Bool = false
    let workbook: Workbook
    
    init(workbook: Workbook, workbookService: WorkbookService) {
        self.workbook = workbook
        _viewModel = StateObject(wrappedValue: WorkbookViewModel(workbook: workbook, workbookService: workbookService))
    }
    
    var body: some View {
        VStack {
            FormulaBarView()
            
            WorksheetView(worksheet: viewModel.worksheets[selectedWorksheetIndex])
            
            WorksheetTabView(worksheets: viewModel.worksheets, selectedIndex: $selectedWorksheetIndex)
        }
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button("Add Worksheet") {
                    addWorksheet()
                }
            }
            ToolbarItem(placement: .primaryAction) {
                Button("Save") {
                    saveWorkbook()
                }
            }
        }
        .sheet(isPresented: $isAddWorksheetPresented) {
            // Add new worksheet view
        }
        .onAppear {
            viewModel.loadWorksheets()
        }
        .alert(item: $viewModel.error) { error in
            Alert(title: Text("Error"), message: Text(error.localizedDescription))
        }
        .overlay(
            Group {
                if viewModel.isLoading {
                    ProgressView()
                }
            }
        )
    }
    
    private func addWorksheet() {
        isAddWorksheetPresented = true
    }
    
    private func saveWorkbook() {
        viewModel.saveWorkbook()
    }
}

class WorkbookViewModel: ObservableObject {
    @Published var worksheets: [Worksheet] = []
    @Published var isLoading: Bool = false
    @Published var error: Error? = nil
    
    private let workbookService: WorkbookService
    private let workbook: Workbook
    
    init(workbook: Workbook, workbookService: WorkbookService) {
        self.workbook = workbook
        self.workbookService = workbookService
    }
    
    func loadWorksheets() {
        isLoading = true
        workbookService.getWorksheets(for: workbook) { [weak self] result in
            DispatchQueue.main.async {
                self?.isLoading = false
                switch result {
                case .success(let worksheets):
                    self?.worksheets = worksheets
                case .failure(let error):
                    self?.error = error
                }
            }
        }
    }
    
    func addWorksheet(name: String) {
        workbookService.addWorksheet(to: workbook, name: name) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let newWorksheet):
                    self?.worksheets.append(newWorksheet)
                case .failure(let error):
                    self?.error = error
                }
            }
        }
    }
    
    func saveWorkbook() {
        isLoading = true
        workbookService.saveWorkbook(workbook) { [weak self] result in
            DispatchQueue.main.async {
                self?.isLoading = false
                if case .failure(let error) = result {
                    self?.error = error
                }
            }
        }
    }
}