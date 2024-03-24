import * as React from "react";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import MuiAlert from "@mui/material/Alert";
import { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useNavigate, Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThreeDotsLoader } from "../helpers/ReusedElements.jsx";


const SignIn = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [userName,setUserName] = useState("");
  const [authApiStatus, setAuthApiStatus] = useState("initial");
  const [snackbarData, setSnackData] = useState({
    open: false,
    msg: "",
    type: "",
  });
  const vertical = "bottom";
  const horizontal = "right";
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = Cookies.get("json_web_token");

    if (jwtToken !== undefined) {
      return navigate("/", { replace: true });
    }
  });

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackData({ open: false });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      setAuthApiStatus('inProgress');
      if ( userName!=="" && password !== "") {  

        const response = await fetch('http://127.0.0.1:8000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_name: userName,
            password: password,
          }),
        });
        setPassword(""); 

        const data = await response.json();
        setAuthApiStatus('initial');
        if (data.access_token) {
          Cookies.set('json_web_token', data.access_token, { expires: 7 }); 
          localStorage.setItem('userName', userName); 
          navigate("/", { replace: true });
        } else {
          setSnackData({ open: true, msg: data.detail, type: "warning" })
        }

      } else {
        setAuthApiStatus('initial');

        setSnackData({
          open: true,
          msg: "Username and password can not be empty!",
          type: "warning",
        });
      }
    } catch (error) { 
      setAuthApiStatus('initial');
      error.detail ?
      setSnackData({ open: true, msg: error.detail, type: "warning" }) : setSnackData({ open: true, msg: "Some error occured", type: "warning" })
    }
  };

  return (
    <div className="sign-up-container">
      <div className="resp-container">
        <div className="form-container">
          <div className="form-content">
            <form className="sign-up-form" onSubmit={handleForm}>
              <h1 className="app-title">Deep Fake Detection</h1>
              <p className="app-caption">Try it now by sigining in</p>
              <Box sx={{ width: "100%" }}>
              <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    mb: 3,
                  }}
                >
                  <AccountCircleOutlinedIcon
                    sx={{
                      color: "action.active",
                      mr: 2,
                      my: 0.5,
                      fontSize: 33,
                    }}
                  />
                  <TextField
                    id="input-User-name"
                    label="User name"
                    variant="standard"
                    fullWidth
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    mb: 3,
                  }}
                >
                  <LockOutlinedIcon
                    sx={{
                      color: "action.active",
                      mr: 2,
                      my: 0.5,
                      fontSize: 33,
                    }}
                  />
                  <FormControl sx={{ width: "310px" }} variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">
                      Password
                    </InputLabel>
                    <Input
                      id="standard-adornment-password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Box>
              </Box>
              {authApiStatus === "inProgress" ? (
                <button className="signup-btn" type="submit">
                  {ThreeDotsLoader(30, 60, 6, "#fff")}
                </button>
              ) : (
                <button className="signup-btn" type="submit">
                  Sign In
                </button>
              )}
              <p>
                Don't have an account? <Link to="/sign-up">Sign Up</Link>
              </p>
            </form>
          </div>
        </div>
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
    </div>
  );
};

export default SignIn;
