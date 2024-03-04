import React, { useEffect, useState } from "react";
import { FaPencilAlt,FaTrashAlt,FaPlus,FaExclamationCircle, FaSearch  } from 'react-icons/fa';
import MyNavbar from './MyNavbar';
import '../css/dashboard.css'
import '../css/modal.css'
import ScrollToTopButton from "./ScrollToTopButton";
import Button from "react-bootstrap/esm/Button";
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner';
import { useForm } from "react-hook-form"
import { useContext } from "react";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';


function Dashboard(){

  const{user}=useContext(UserContext)
  const[projects,setProjects]=useState([])
  const[error,setError]=useState(false)
  const[errormessage,setErrorMessage]=useState(' ')
  const [show, setShow] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const form = useForm()
  const {register, control, handleSubmit, formState,reset,setValue}=form;
  const {errors,isSubmitting,isDirty,isValid}=formState

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${Cookies.get('token')}`
  };

  const config = {
    headers: {
      ...headers
    }
  }

  //get Projects 
  useEffect(()=>{
    const fetchProjectData = async () => {
      try {
     
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/api/projects/${userId}`, config);
        if (response.status === 200) {
          setProjects(response.data);
        }
      } catch (error) {
        // console.error('Error fetching project data:', error);
        setError(true)
        setErrorMessage(" There is an error in fetching your project details due to Internal Server Error, Try Again Later!")
        // Handle the error, such as displaying an error message to the user
        // For example, you can set an error state to display a message in the UI
      }
    };
  
    fetchProjectData();
  },[])


//search bar
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Filter projects based on the search query
    const filtered = projects.filter(project =>
      project.Project_Name.toLowerCase().includes(query.toLowerCase()) ||
      (project.Project_Stack && project.Project_Stack.some(stackItem => stackItem.toLowerCase().includes(query.toLowerCase())))
    );
    setFilteredProjects(filtered);
    if(filtered.length===0){
      setError(true)
      setErrorMessage("The project you searched for does not exist!");
    }
   
  };


  const handleShowModal=function(project){
      // console.log("projectvalue", project)
     
      setSelectedProject(project)
      setShow(true)

    if (project) {
      localStorage.setItem("projectId", project["_id"]);
      setValue('Project_Name', project['Project_Name']);
      setValue('Project_Description', project['Project_Description']);
      setValue('Project_Stack', project['Project_Stack']);
      setValue('Project_Github', project['Project_Github'] );
      setValue('Project_Demo', project['Project_Demo']);
    } else {
    // Clear form values for adding
      setValue('Project_Name', '');
      setValue('Project_Description', '');
      setValue('Project_Stack', '');
      setValue('Project_Github', '');
      setValue('Project_Demo', '');
    }
  }

  const handleCloseModal = () => {

     setSelectedProject(null)
     setShow(false);

  };
  
  //Add Project
  const handleAddProject= async function(data){
    try{
      //Add Project Logic
    //  console.log(data)
     const userId = localStorage.getItem('userId');

     const ProjectData = {
      userId: userId,
      ...data,
      Project_Stack: data.Project_Stack.split(',').map(tech => tech.trim())     
    };
   console.log("ProjectData", ProjectData)
    const response = await axios.post('http://localhost:3000/api/project', ProjectData, config)
   
    const newProject = response.data;

    // console.log("newProject", newProject)

    setProjects(
      [...projects, newProject]
    )
    
    setShow(false);

    toast.success('Project added successfully!');
    }
    catch (error) {
      // console.error('Error adding project:', error);
      // Handle error (e.g., display error message to user)
      toast.error('Failed to add project. Please try again later.');
    }
  }

  //Edit Project
  const handleEditProject = async function (data) {
    try {
        const projectId = localStorage.getItem("projectId");

        const updateProjectIndex = projects.findIndex((project) => {
            return project["_id"] === projectId;
        });

        const response = await axios.put(`http://localhost:3000/api/project/${projectId}`, data, config);
        const updatedProjectData = response.data;

        const updatedProjects = [...projects];
        updatedProjects[updateProjectIndex] = updatedProjectData;
        setProjects(updatedProjects);

        // console.log("updatedProjectdata", updatedProjectData);
        setShow(false);
        toast.success('Project Updated successfully!');
        localStorage.removeItem("projectId");
    } catch (error) {
        // console.error('Error updating project:', error);
        toast.error('Failed to Update project. Please try again later.');
    }
};
  const handleDeleteProject= async function(data){
    try{
    //Delete Project Logic
   const userId = localStorage.getItem('userId');
   const projectId = data["_id"];

   const response = await axios.delete(`http://localhost:3000/api/project/${projectId}`, config)
   
   const deletedProjectId = response.data["_id"];

   const updatedProjects = projects.filter((project)=>{
    return project["_id"]!==deletedProjectId;
   })

   setProjects(updatedProjects);

   toast.success('Project Deleted successfully!');
  }
  catch(error){
    toast.error(error.response.data.Message);
  }
  }

  return(
        <>
        <MyNavbar fixed={false}/>
        <section>
         <div className="dashboard_container">

          <div className="search_container">
           <div className="search_bar">
             <input className="search_input" type="text" placeholder="Search..." value={searchQuery}
            onChange={handleSearch} />
             <FaSearch className="search_icon" />
           </div>
          </div>

           <div className="add_button">
             <Button  variant="outline-dark" style={{ backgroundColor: '#e1c16e', marginLeft: '10px' }}  onClick={() => handleShowModal(null)}> <FaPlus /> Add Project</Button>
           </div>
           <div className="projects_container">
            {error? ( <div className="error_message">
                         <div className="error_body"> {errormessage}</div>
                         <FaExclamationCircle/>
                      </div>) : 
                      ( (searchQuery && filteredProjects.length > 0) || (!searchQuery && projects.length > 0) ? (
                        (searchQuery ? filteredProjects : projects).map((project, index) => (
                          <div key={index} className="project_card">
                            <div className="project_container">
                              <div className="project_header">
                                <p className="project-title" style={{margin:0}}>{project["Project_Name"]}</p>
                                <Button onClick={() => handleShowModal(project)} className="edit_icon"><FaPencilAlt /></Button>
                              </div>
                              <p className="project_id">{`Project id: ${project['_id']}`}</p>
                              <p className="project_desc"><span>Project Description</span> {project["Project_Description"]}</p>
                              <p><span className="tech_stack">Technologies Used:</span> {Array.isArray(project["Project_Stack"]) ? project["Project_Stack"].join(', ') : ''}</p>
                              <div className="project_links">
                                 <a href={project["Project_Github"]} target="_blank" rel="noopener noreferrer">
                                   <Button variant="outline-dark" style={{ backgroundColor: '#e1c16e', marginLeft: '10px' }}>GitHub</Button>
                                 </a>
                                 <a href={project["Project_Demo"]} target="_blank" rel="noopener noreferrer">
                                   <Button variant="outline-dark" style={{ backgroundColor: '#e1c16e', marginLeft: '10px' }}>Demo</Button>
                                 </a>
                             </div>
                            </div> 
                            <Button onClick={()=>handleDeleteProject(project)} className="delete_button" variant="danger" style={{ marginLeft: '10px' }}>Delete <FaTrashAlt /></Button>
                          </div>   
                        ))
                       )  :  (
                       <div className="error_message">
                          <div className="error_body"> You were not added any projects yet!, Click on Add Project Button to add your Projects...</div>
                          <FaExclamationCircle/>
                       </div>
                       ) 
                      )
            }
                  </div>
         </div>
         </section>
        <ScrollToTopButton backgroundColor="#e1c16e" color="black" />
        <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProject?'Edit Project': 'Add Project'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <form className='modalform'  onSubmit={handleSubmit(selectedProject? handleEditProject : handleAddProject)} noValidate>
          <label>Project Name</label>
          <input type="text" className='modalinput' {...register("Project_Name",{
          required:{
            value:true,
            message:"Enter Your Project Name"
          } 
          })}  id="Project_Name" placeholder='Enter your Project Name' />
          {errors.Project_Name&&<span className="error">{errors.Project_Name?.message}</span>}
          <label>Project Description</label>
          <textarea {...register("Project_Description",{
          required:{
            value:true,
            message:"Enter Your Project Description"
          } 
          })}  id="Project_Description" placeholder='Enter your Project Description'></textarea>
          {errors.Project_Description&&<span className="error">{errors.Project_Description?.message}</span>}
          <label>Technologies Used</label>
          <input type="text" className='modalinput' {...register("Project_Stack",{
          required:{
            value:true,
            message:"Enter the technologies with which you built your project"
          } 
          })}  id="Project_Stack" placeholder='Enter the Tech Stack' />
           {errors.Project_Stack&&<span className="error">{errors.Project_Stack?.message}</span>}
          <label>Github Link</label>
          <input type="text" className='modalinput' {...register("Project_Github",{
          required:{
            value:true,
            message:"Enter Your Project Github Repository Link"
          } 
          })}  id="Project_Github" placeholder='Mention Project Github Repo Link' />
           {errors.Project_Github&&<span className="error">{errors.Project_Github?.message}</span>}
          <label>Website Demo Link</label>
          <input type="text" className='modalinput' {...register("Project_Demo",{
          required:{
            value:true,
            message:"Enter Your Project Website or Demo Video Link"
          } 
          })}  id="Project_Demo" placeholder={`Mention Project Website's Demo, Blog or Video Link`} 
          />
          {errors.Project_Demo&&<span className="error">{errors.Project_Demo?.message}</span>}
         <button className="dashboard_buttons" disabled={!isDirty||isSubmitting}>
         {selectedProject?(
         isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="mr-2"
                />
                Updating...
              </>
            ) : (
              'Update'
            )):(
              isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="mr-2"
                  />
                  Adding...
                </>
              ) : (
                'Add project'
              )
            )}
        </button>
        </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position="bottom-left" />
        </>
    )
}

export default Dashboard;