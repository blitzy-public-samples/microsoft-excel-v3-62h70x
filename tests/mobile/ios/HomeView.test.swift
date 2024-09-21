import XCTest
@testable import ExcelApp
import ViewInspector

class HomeViewTests: XCTestCase {
    private var sut: HomeView!
    private var viewModel: HomeViewModel!

    override func setUpWithError() throws {
        // Initialize viewModel with mock data
        viewModel = HomeViewModel(workbookService: MockWorkbookService())
        
        // Create an instance of HomeView with the viewModel
        sut = HomeView(viewModel: viewModel)
    }

    override func tearDownWithError() throws {
        sut = nil
        viewModel = nil
    }

    func testHomeViewRendersCorrectly() throws {
        let view = try sut.inspect()
        
        // Assert that the navigation title is 'Excel'
        XCTAssertEqual(try view.navigationView().navigationBarTitle().string(), "Excel")
        
        // Assert that the search bar is present
        XCTAssertNoThrow(try view.find(ViewType.SearchBar.self))
        
        // Assert that the 'Create New Workbook' button is present
        XCTAssertNoThrow(try view.find(ViewType.Button.self, where: { try $0.title().string() == "Create New Workbook" }))
        
        // Assert that the RecentWorkbooksView is present
        XCTAssertNoThrow(try view.find(RecentWorkbooksView.self))
        
        // Assert that the TemplatesView is present
        XCTAssertNoThrow(try view.find(TemplatesView.self))
    }

    func testCreateNewWorkbookButtonTapped() throws {
        let view = try sut.inspect()
        
        // Use ViewInspector to find the 'Create New Workbook' button
        let createButton = try view.find(ViewType.Button.self, where: { try $0.title().string() == "Create New Workbook" })
        
        // Simulate a tap on the button
        try createButton.tap()
        
        // Assert that isCreateWorkbookPresented in the viewModel is set to true
        XCTAssertTrue(viewModel.isCreateWorkbookPresented)
    }

    func testSearchFunctionality() throws {
        let view = try sut.inspect()
        
        // Use ViewInspector to find the search input field
        let searchField = try view.find(ViewType.SearchBar.self)
        
        // Enter a search query
        let searchQuery = "Test Workbook"
        try searchField.setInput(searchQuery)
        
        // Assert that the viewModel's searchText is updated
        XCTAssertEqual(viewModel.searchText, searchQuery)
        
        // Assert that the filtered workbooks in the viewModel match the search query
        XCTAssertTrue(viewModel.filteredWorkbooks.allSatisfy { $0.name.contains(searchQuery) })
    }
}