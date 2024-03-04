const express=require('express')
const Project=require('../model/projectmodel')
const User=require('../model/authmodel')

const { authenticateToken } = require('../middleware/middleware');

//using Router method from express
const router=express.Router()

// router.get('/testproject',authenticateToken,(req,res)=>{
//     res.send('API Connection Successfull')
//  })

//get project
router.get('/projects/:userId', authenticateToken, (req,res)=>{
    const userId= req.params.userId;
    if(!userId){
        return res.status(400).json({ message: 'User ID is required' });
    }

    Project.find({ userId: userId })
    .then((projects) => {
      console.log(projects);
      res.status(200).json(projects);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    });
  
})

//add project
router.post('/project', authenticateToken, (req, res) => {
    const projectData = req.body;
    const userId = projectData.userId;
  
    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
  
    // Create the project in the Project collection
    Project.create(projectData)
      .then((project) => {
        // Project created successfully, now update the user document
        User.findById(userId)
          .then((user) => {
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
            // Add the project's ID to the projects array in the user document
            user.Projects.push(project._id);
            // Save the updated user document
            return user.save();
          })
          .then(() => {
            // Send a success response with the created project
            res.status(200).json(project);
          })
          .catch(error => {
            console.error('Error updating user with project ID:', error);
            res.status(500).json({ message: 'Failed to update user with project ID' });
          });
      })
      .catch(error => {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Failed to create project' });
      });
  });
  
//update project
  router.put('/project/:projectId', authenticateToken, (req, res) => {
    const projectId = req.params.projectId;
    const updatedProjectData = req.body;

    Project.findOneAndUpdate(
        { _id: projectId }, // Find the project by its ID
        updatedProjectData, // Update the project with the provided data
        { new: true } // Return the updated project
    )
    .then(updatedProject => {
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(updatedProject); // Send the updated project in the response
    })
    .catch(error => {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    });
});

//delete project
router.delete('/project/:projectId', authenticateToken, (req, res) => {
  const projectId = req.params.projectId;

  // Delete the project document from the Project collection
  Project.findByIdAndDelete(projectId)
      .then((deletedProject) => {
          if (!deletedProject) {
              return res.status(404).json({ message: 'Project not found' });
          }

          const userId = deletedProject.userId;

          // Remove the projectId from the Projects array in the User document
          User.findByIdAndUpdate(
              userId,
              { $pull: { Projects: projectId } },
              { new: true }
          )
          .then((updatedUser) => {
              if (!updatedUser) {
                  return res.status(404).json({ message: 'User not found' });
              }

              res.status(200).json(deletedProject);
          })
          .catch((error) => {
              console.error('Error updating user with project ID:', error);
              res.status(500).json({ message: 'Failed to update user with project ID' });
          });
      })
      .catch((error) => {
          console.error('Error deleting project:', error);
          res.status(500).json({ message: 'Failed to delete project' });
      });
});


//export the Router 
module.exports=router;