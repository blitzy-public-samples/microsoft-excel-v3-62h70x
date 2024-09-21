import SwiftUI
import ExcelCore
import Combine

struct SettingsView: View {
    @StateObject private var viewModel: SettingsViewModel
    @Environment(\.presentationMode) var presentationMode

    init(settingsService: SettingsService) {
        _viewModel = StateObject(wrappedValue: SettingsViewModel(settingsService: settingsService))
    }

    var body: some View {
        NavigationView {
            Form {
                // General Settings
                Section(header: Text("General")) {
                    Picker("Theme", selection: $viewModel.theme) {
                        Text("System").tag(Theme.system)
                        Text("Light").tag(Theme.light)
                        Text("Dark").tag(Theme.dark)
                    }
                    Picker("Language", selection: $viewModel.language) {
                        Text("System Default").tag(Language.systemDefault)
                        Text("English").tag(Language.english)
                        Text("Spanish").tag(Language.spanish)
                        Text("French").tag(Language.french)
                        Text("German").tag(Language.german)
                        Text("Chinese").tag(Language.chinese)
                        Text("Japanese").tag(Language.japanese)
                    }
                }

                // Calculation Settings
                Section(header: Text("Calculation")) {
                    Toggle("Automatic Calculation", isOn: $viewModel.isAutomaticCalculationEnabled)
                    Toggle("Enable Iteration", isOn: $viewModel.isIterationEnabled)
                }

                // Editing Settings
                Section(header: Text("Editing")) {
                    Toggle("Autocomplete", isOn: $viewModel.isAutocompleteEnabled)
                    Toggle("Drag and Drop", isOn: $viewModel.isDragAndDropEnabled)
                }

                // View Settings
                Section(header: Text("View")) {
                    Toggle("Show Formula Bar", isOn: $viewModel.isFormulaBarVisible)
                    Toggle("Show Gridlines", isOn: $viewModel.areGridlinesVisible)
                    Toggle("Show Headers", isOn: $viewModel.areHeadersVisible)
                }

                // Account Settings
                Section(header: Text("Account")) {
                    Button("Sign Out") {
                        viewModel.signOut()
                    }
                    .foregroundColor(.red)
                }
            }
            .navigationTitle("Settings")
            .navigationBarItems(trailing: Button("Done") {
                saveSettings()
            })
        }
        .onAppear {
            viewModel.loadSettings()
        }
    }

    private func saveSettings() {
        viewModel.saveSettings()
        presentationMode.wrappedValue.dismiss()
    }
}

class SettingsViewModel: ObservableObject {
    @Published var theme: Theme = .system
    @Published var language: Language = .systemDefault
    @Published var isAutomaticCalculationEnabled: Bool = true
    @Published var isIterationEnabled: Bool = false
    @Published var isAutocompleteEnabled: Bool = true
    @Published var isDragAndDropEnabled: Bool = true
    @Published var isFormulaBarVisible: Bool = true
    @Published var areGridlinesVisible: Bool = true
    @Published var areHeadersVisible: Bool = true

    private let settingsService: SettingsService
    private var cancellables: Set<AnyCancellable> = []

    init(settingsService: SettingsService) {
        self.settingsService = settingsService
    }

    func loadSettings() {
        settingsService.getSettings()
            .receive(on: DispatchQueue.main)
            .sink { completion in
                switch completion {
                case .finished:
                    break
                case .failure(let error):
                    print("Error loading settings: \(error)")
                    // TODO: Handle error and update UI
                }
            } receiveValue: { settings in
                self.theme = settings.theme
                self.language = settings.language
                self.isAutomaticCalculationEnabled = settings.isAutomaticCalculationEnabled
                self.isIterationEnabled = settings.isIterationEnabled
                self.isAutocompleteEnabled = settings.isAutocompleteEnabled
                self.isDragAndDropEnabled = settings.isDragAndDropEnabled
                self.isFormulaBarVisible = settings.isFormulaBarVisible
                self.areGridlinesVisible = settings.areGridlinesVisible
                self.areHeadersVisible = settings.areHeadersVisible
            }
            .store(in: &cancellables)
    }

    func saveSettings() {
        let settings = Settings(
            theme: theme,
            language: language,
            isAutomaticCalculationEnabled: isAutomaticCalculationEnabled,
            isIterationEnabled: isIterationEnabled,
            isAutocompleteEnabled: isAutocompleteEnabled,
            isDragAndDropEnabled: isDragAndDropEnabled,
            isFormulaBarVisible: isFormulaBarVisible,
            areGridlinesVisible: areGridlinesVisible,
            areHeadersVisible: areHeadersVisible
        )

        settingsService.saveSettings(settings)
            .receive(on: DispatchQueue.main)
            .sink { completion in
                switch completion {
                case .finished:
                    break
                case .failure(let error):
                    print("Error saving settings: \(error)")
                    // TODO: Handle error and update UI
                }
            } receiveValue: { _ in
                // TODO: Show success message or update UI
            }
            .store(in: &cancellables)
    }

    func signOut() {
        // TODO: Implement sign out functionality
        // This should call the appropriate authentication service
        // Clear local user data and navigate to the login screen
    }
}

enum Theme: String, CaseIterable, Identifiable {
    case system, light, dark
    var id: Self { self }
}

enum Language: String, CaseIterable, Identifiable {
    case systemDefault, english, spanish, french, german, chinese, japanese
    var id: Self { self }
}