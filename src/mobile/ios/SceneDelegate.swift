import UIKit
import ExcelCore

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = (scene as? UIWindowScene) else { return }
        
        // Create and configure the window for the new scene
        window = UIWindow(windowScene: windowScene)
        
        // Set up the root view controller for the window
        let rootViewController = RootViewController() // Assuming you have a RootViewController
        window?.rootViewController = rootViewController
        
        // Initialize any scene-specific components or services
        ExcelCore.shared.initializeForScene()
        
        // Handle any connection options (e.g., URL contexts, user activities)
        if let userActivity = connectionOptions.userActivities.first {
            self.scene(scene, continue: userActivity)
        }
        
        // Make the window visible
        window?.makeKeyAndVisible()
    }

    func sceneDidDisconnect(_ scene: UIScene) {
        // Save any scene-specific state
        ExcelCore.shared.saveSceneState()
        
        // Release any resources that were specific to the disconnected scene
        // For example, release any strong references to objects related to this scene
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        // Restart any tasks that were paused (or not yet started) while the scene was inactive
        ExcelCore.shared.resumeTasks()
        
        // Refresh the user interface
        window?.rootViewController?.view.setNeedsLayout()
        
        // Resume any background tasks or services specific to this scene
        ExcelCore.shared.resumeBackgroundTasks()
    }

    func sceneWillResignActive(_ scene: UIScene) {
        // Pause ongoing tasks
        ExcelCore.shared.pauseTasks()
        
        // Disable timers
        ExcelCore.shared.disableTimers()
        
        // Throttle down OpenGL ES frame rates
        // If you're using Metal or any graphics-intensive features, adjust accordingly
        
        // Save any unsaved changes in the UI
        ExcelCore.shared.saveUnsavedChanges()
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // Undo any changes made when entering the background
        ExcelCore.shared.prepareForForeground()
        
        // Refresh the user interface
        window?.rootViewController?.view.setNeedsLayout()
        
        // Prepare for active use of the scene
        ExcelCore.shared.prepareForActiveUse()
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // Save data for the scene
        ExcelCore.shared.saveSceneData()
        
        // Release shared resources
        ExcelCore.shared.releaseSharedResources()
        
        // Store enough scene-specific state information to restore the scene back to its current state
        ExcelCore.shared.storeSceneState()
    }
}