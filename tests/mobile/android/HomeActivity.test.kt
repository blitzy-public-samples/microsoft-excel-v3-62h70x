@RunWith(RobolectricTestRunner::class)
class HomeActivityTest {

    private lateinit var activity: HomeActivity
    private lateinit var viewModel: HomeViewModel

    @Before
    fun setup() {
        // Initialize viewModel with mock data
        viewModel = HomeViewModel().apply {
            // Add mock data to the viewModel
            // For example:
            // recentWorkbooks.value = listOf(mockWorkbook1, mockWorkbook2)
            // templates.value = listOf(mockTemplate1, mockTemplate2)
        }

        // Create an instance of HomeActivity using Robolectric
        activity = Robolectric.buildActivity(HomeActivity::class.java).create().get()

        // Set the viewModel for the activity
        activity.viewModel = viewModel
    }

    @Test
    fun testActivityCreation() {
        // Assert that activity is not null
        assertNotNull(activity)
    }

    @Test
    fun testUIComponentsPresent() {
        // Check that the search bar is displayed
        Espresso.onView(ViewMatchers.withId(R.id.searchBar))
            .check(ViewAssertions.matches(ViewMatchers.isDisplayed()))

        // Check that the 'Create New Workbook' button is displayed
        Espresso.onView(ViewMatchers.withId(R.id.createNewWorkbookButton))
            .check(ViewAssertions.matches(ViewMatchers.isDisplayed()))

        // Check that the RecyclerView for recent workbooks is displayed
        Espresso.onView(ViewMatchers.withId(R.id.recentWorkbooksRecyclerView))
            .check(ViewAssertions.matches(ViewMatchers.isDisplayed()))

        // Check that the RecyclerView for templates is displayed
        Espresso.onView(ViewMatchers.withId(R.id.templatesRecyclerView))
            .check(ViewAssertions.matches(ViewMatchers.isDisplayed()))
    }

    @Test
    fun testCreateNewWorkbookButton() {
        // Click on the 'Create New Workbook' button
        Espresso.onView(ViewMatchers.withId(R.id.createNewWorkbookButton)).perform(ViewActions.click())

        // Check that the create workbook dialog is displayed
        Espresso.onView(ViewMatchers.withId(R.id.createWorkbookDialog))
            .check(ViewAssertions.matches(ViewMatchers.isDisplayed()))
    }

    @Test
    fun testSearchFunctionality() {
        // Enter a search query in the search input
        val searchQuery = "Test Workbook"
        Espresso.onView(ViewMatchers.withId(R.id.searchBar))
            .perform(ViewActions.typeText(searchQuery))

        // Verify that the viewModel's searchText is updated
        assertEquals(searchQuery, viewModel.searchText.value)

        // Check that the RecyclerView displays only the filtered workbooks
        // This step might require custom matchers or additional logic to verify the filtered results
        // For example:
        // Espresso.onView(ViewMatchers.withId(R.id.recentWorkbooksRecyclerView))
        //     .check(ViewAssertions.matches(hasFilteredItems(searchQuery)))
    }
}