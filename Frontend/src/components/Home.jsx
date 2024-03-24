import React, { useState, useRef ,useEffect } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";
import { Form, Row, Col, Button } from "react-bootstrap";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import upload from'../images/upload.png';
import { useNavigate } from "react-router-dom"; 
import Cookies from "js-cookie"; 
import {jwtDecode} from 'jwt-decode';
import { ThreeDotsLoader } from "../helpers/ReusedElements.jsx";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


const Home = () => {
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [state, setState] = useState({ title: "", description: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isPreviewAvailable, setIsPreviewAvailable] = useState();
  const dropRef = useRef();
  const [anchorElUser, setAnchorElUser] = useState(true);
  const [authApiStatus, setAuthApiStatus] = useState("initial");
  const [snackbarData, setSnackData] = useState({
    open: false,
    msg: "",
    type: "",
  });
  const vertical = "bottom";
  const horizontal = "right";
  // const settings = ["Profile", "Logout"];
  const navigate = useNavigate();
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const isTokenValid = (token) => {
    try {
      const { exp } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        return false; 
      }
      return true; 
    } catch (error) {
      return false; 
    }
  };
  const handleLogout = () => {
    Cookies.remove('json_web_token');
    localStorage.removeItem('userName');
    navigate('/sign-in');
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackData({ open: false });
  };
  const onDrop = (files) => {
    const [uploadedFile] = files;
    if (uploadedFile.type.match(/image\/*/) === null) {
      setErrorMsg("Only image files are allowed.");
      setIsPreviewAvailable(false);
      return;
    } 
    else 
    {
      setErrorMsg("");
    }

    setFile(uploadedFile);
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(true);
  };

  const handleOnSubmit = async (event) => {
    setAuthApiStatus('inProgress');
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', file);  
    try
    {
    const response = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          headers: {
            // 'Content-Type': 'multipart/form-data', 
            'Accept' :'*/*', 
            'Token' : Cookies.get('json_web_token') 

          }, 
    
          body: formData, 
        });
        setAuthApiStatus('initial'); 
      const data= await response.json(); 
      if(data.prediction !== undefined) 
      {  
        let  msg= data.prediction ? "Image is real" :"Image is fake";
        setSnackData({ open: true, msg: msg, type: data.prediction ? "success" :"error" });
      } 
      else 
      {
        setSnackData({ open: true, msg: data.detail, type: "error" });

      }

    } 
    catch(error) 
    { 
      setSnackData({ open: true, msg: "Some error occured", type: "warning" });
      setAuthApiStatus('initial');
    }
  };
  useEffect(() => {
    const token = Cookies.get('json_web_token'); 
    
    if (!token || !isTokenValid(token)) {
      Cookies.remove('json_web_token');
      navigate('/sign-in');
    }
  }, [navigate]);

  return (
    <>
      <nav
        style={{
          background: "black",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          gap:'50px'
        }}
      >  
      <div style={{
         display:"flex",
         alignItems: "center",

        }}>
        <AccountCircleOutlinedIcon
                    sx={{
                      color: "action.white",
                      mr: 2,
                      my: 0.5,
                      fontSize: 40,
                    }}
        /> 
       
         <h3>{localStorage.getItem('userName')} </h3>
        </div>
        <h2>Deep Fake Detection</h2> 
        <a onClick={handleLogout} style={{cursor:'pointer'}}>
        <h3>Log out</h3>
        </a>

        
      </nav>
      <div className="card-container">
        <Form className="upload-form" onSubmit={handleOnSubmit}>
          {/* Form fields and error message */}
          {errorMsg && <p style={{color:"red"}}> **{errorMsg}</p>}
          <div className="upload-section" style= {{ display:'flex',flexDirection:'column',alignItems:'center',padding:'20px'}}> 
          <img  style= {{height:'150px',width:'150px'}} src={upload} alt="Upload" />
            <Dropzone onDrop={onDrop} accept="image/*">
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps({ className: "drop-zone" })}
                  ref={dropRef}
                >
                  <input {...getInputProps()} />
                  <p>
                    Drag and drop an image file OR click here to select an image
                  </p>
                </div>
              )}
            </Dropzone>
            {isPreviewAvailable && previewSrc && (
              <div className="image-preview">
                <img className="preview-image" src={previewSrc} alt="Preview" />
              </div>
            )}
          </div> 
          {authApiStatus === "inProgress" ? (
                <button className="signup-btn" type="submit">
                  {ThreeDotsLoader(30, 60, 6, "#fff")}
                </button>
              ) : (
                <button className="signup-btn" type="submit">
                  Predict 
                </button>
              )}
        </Form>
      </div>
      <Snackbar
        open={snackbarData.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical, horizontal }}
        key={vertical + horizontal}
        sx={{ margin: "0px 15px 15px 0px" }}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarData.type}
          sx={{ width: "100%" }}
        >
          {snackbarData.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Home;
