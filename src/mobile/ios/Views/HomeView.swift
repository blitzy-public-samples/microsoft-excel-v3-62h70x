import SwiftUI
import ExcelCore
import Combine

struct HomeView: View {
    @StateObject private var viewModel: HomeViewModel
    @State private var isCreateWorkbookPresented: Bool = false
    @State private var searchText: String = ""

    var body: some View {
        NavigationView {
            VStack {
                SearchBar(text: $searchText)
                    .padding()

                Button(action: createNewWorkbook) {
                    Text("Create New Workbook")
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
                .padding()

                RecentWorkbooksView(workbooks: viewModel.recentWorkbooks.filter { searchText.isEmpty || $0.name.localizedCaseInsensitiveContains(searchText) })

                TemplatesView(templates: viewModel.templates)

                Spacer()
            }
            .navigationTitle("Excel")
        }
        .sheet(isPresented: $isCreateWorkbookPresented) {
            CreateWorkbookView(isPresented: $isCreateWorkbookPresented, onCreateWorkbook: viewModel.createWorkbook)
        }
        .onAppear {
            viewModel.fetchRecentWorkbooks()
            viewModel.fetchTemplates()
        }
    }

    func createNewWorkbook() {
        isCreateWorkbookPresented = true
    }
}

class HomeViewModel: ObservableObject {
    @Published var recentWorkbooks: [Workbook] = []
    @Published var templates: [WorkbookTemplate] = []
    private let workbookService: WorkbookService

    init(workbookService: WorkbookService) {
        self.workbookService = workbookService
    }

    func fetchRecentWorkbooks() {
        workbookService.getRecentWorkbooks { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let workbooks):
                    self?.recentWorkbooks = workbooks
                case .failure(let error):
                    // TODO: Handle error and update UI
                    print("Error fetching recent workbooks: \(error)")
                }
            }
        }
    }

    func fetchTemplates() {
        workbookService.getTemplates { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let templates):
                    self?.templates = templates
                case .failure(let error):
                    // TODO: Handle error and update UI
                    print("Error fetching templates: \(error)")
                }
            }
        }
    }

    func createWorkbook(name: String, template: WorkbookTemplate?) {
        workbookService.createWorkbook(name: name, template: template) { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let workbook):
                    self?.recentWorkbooks.insert(workbook, at: 0)
                    // TODO: Navigate to the new workbook
                case .failure(let error):
                    // TODO: Handle error and update UI
                    print("Error creating workbook: \(error)")
                }
            }
        }
    }
}