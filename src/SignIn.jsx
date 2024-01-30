import "./components/styles/SignIn.css";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  Link,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  HStack,
  PinInput,
  PinInputField,
  Spinner,
  useColorMode,
  useColorModeValue,
  useToast,
  Alert,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useDisclosure,
  Flex,
  Container,
  CircularProgress,
  Stack,
  InputGroup,
  InputLeftAddon,
  Input,
  InputRightAddon,
} from "@chakra-ui/react";
import { TbAlertTriangleFilled } from "react-icons/tb";
import { IoQrCode } from "react-icons/io5";
import React, { useEffect } from "react";
import ReachOutTitle from "./components/ReachOutTitle";
import ModalEndHelperLinks from "./components/ModalEndHelperLinks";
import {
  BACKEND_ROOT_URL,
  CLIENT_BORDER_AROUND_TIMEOUT,
  CLIENT_SYN_TIMEOUT,
  GOOGLE_CLIENT_ID,
  LOGIN_QR_EXPIRY_TIME,
  LOGIN_QR_SESSION_TIMEOUT,
  base_json_header,
} from "./constants";
import PageTransition from "./components/configs/PageTransition";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { AnimatePresence, color, motion } from "framer-motion";
import axios from "./components/configs/customAxios";
import { Link as ReactRouterLink } from "react-router-dom";
import coreAxios from "axios";
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PHONE_REGEX = /^\+\d{2,3}\s\d{5}\-\d{5}$/;
const codeToMessage = {
  required_signin: "Sign in is required to proceed further...",
  signin_to_continue: "To continue, please sign in!",
};

const LoginQrContext = React.createContext({
  state: "ready",
  qr_image: null,
  // session: { running: false, sessionTimerId: null, qrRefreshTimerId: null },
  set_state: (new_state) => {},
  set_qr_image: (new_qr_image_data) => {},
  set_session: (edited_session) => {},
});

function SignIn() {
  const [mode, setMode] = React.useState("QR"); // google | QR
  const { colorMode } = useColorMode();
  const [loginQrContext, setLoginQrContext] = React.useState({
    state: "ready",
    qr_image: null,
  });

  const login_qr_set_state = (new_state) => {
    // assume Asserting as new_state is in [ready, loading, generated, suspended, unavailable, error]

    setLoginQrContext(e => ({ ...e, state: new_state }));
  };

  const login_qr_set_session = (edited_session) => {
    // assume Asserting as new_state is in [generate, generating, generated]

    setLoginQrContext(e => ({ ...e, session: edited_session }));
  };

  const login_qr_set_image_data = (new_image_data) => {
    setLoginQrContext(e => ({ ...e, qr_image: new_image_data }));
  };

  return (
    <PageTransition>
      <LoginQrContext.Provider
        value={{
          ...loginQrContext,
          set_state: login_qr_set_state,
          set_qr_image: login_qr_set_image_data,
          set_session: login_qr_set_session,
        }}
      >
        <Center
          h="calc(100vh - 10vh)"
          alignItems={"flex-start"}
          marginTop={"10vh"}
        >
          <motion.div
            className="modal_container"
            style={{ height: "max-content" }}
          >
            <ReachOutTitle style={{ marginBottom: "0.8rem" }}>
              <b style={{ fontSize: "1.5rem" }}>Sign In</b>
            </ReachOutTitle>
            <center>
              <small>Choose Sign-In method</small>
            </center>
            <div
              style={{
                display: "flex",
                marginTop: "1rem",
                gap: "2rem",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => {
                  setMode("google");
                }}
                style={{
                  color:
                    mode === "google"
                      ? "#59CE8F"
                      : colorMode === "dark"
                      ? "#ffffff80"
                      : "#49494980",
                  fontSize: "0.9rem",
                  fontWeight: mode === "google" ? "600" : "500",
                  boxShadow:
                    mode === "google"
                      ? "0 0 5px 2px #59CE8F50"
                      : colorMode === "dark"
                      ? "0 0 5px 2px #ffffff30"
                      : "0 0 5px 2px #49494930",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "9px",
                }}
              >
                Credentials
              </button>
              <button
                onClick={() => {
                  setMode("QR");
                }}
                style={{
                  color:
                    mode === "QR"
                      ? "#59CE8F"
                      : colorMode === "dark"
                      ? "#ffffff80"
                      : "#49494980",
                  fontSize: "0.9rem",
                  fontWeight: mode === "QR" ? "600" : "500",
                  boxShadow:
                    mode === "QR"
                      ? "0 0 5px 2px #59CE8F50"
                      : colorMode === "dark"
                      ? "0 0 5px 2px #ffffff30"
                      : "0 0 5px 2px #49494930",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "9px",
                }}
              >
                Login QR
              </button>
            </div>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <AnimatePresence mode="wait">
                {mode === "google" ? (
                  <motion.div
                    key="sign_in_with_google"
                    initial={{ translateX: "-20px", opacity: 0 }}
                    transition={{ type: "tween", duration: 0.1 }}
                    animate={{ translateX: 0, opacity: 1 }}
                    exit={{ translateX: -20, opacity: 0 }}
                  >
                    <SignInByGoogle />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sign_in_with_login_qr"
                    initial={{ translateX: "20px", opacity: 0 }}
                    transition={{ type: "tween", duration: 0.1 }}
                    animate={{ translateX: 0, opacity: 1 }}
                    exit={{ translateX: 20, opacity: 0 }}
                  >
                    <SignInByLoginQr />
                  </motion.div>
                )}
              </AnimatePresence>
            </GoogleOAuthProvider>
            <ModalEndHelperLinks />
          </motion.div>
        </Center>
      </LoginQrContext.Provider>
    </PageTransition>
  );
}

function SignInByGoogle() {
  const [currentState, setCurrentState] = React.useState("idle"); // idle | loading | success
  const toast = useToast();

  const loginSuccessCb = (response) => {
    setCurrentState("loading");
    axios
      .post(`/auth2/web/login/`, {
        mode: "google_token",
        token: response.access_token,
      })
      .then((res) => {
        setCurrentState("success");
        window.location.href = "/web";
      })
      .catch((res) => {
        // aloing with message
        console.log("err::", res);
        if (res.response.status === 400) {
          if (res.response.data["message"] === "UNKNOWN_GOOGLE_TOKEN_EMAIL") {
            // Email not linked with any ReachOut profile, please login through ReachOutProfile ones
            toast({
              description:
                "Email doesn't exists, Choose google email which is associated to your ReachOut profile",
              status: "error",
              isClosable: true,
              duration: 100000,
            });
          }
        }
        setCurrentState("idle"); // restart mode
      });
  };

  const login = useGoogleLogin({
    onSuccess: loginSuccessCb,
    onError: (error) =>
      console.error("Client Side {GOOGLE_LOGIN_ATTEMPT_FAILED}:", error),
  });

  return (
    <MockRazorPayUI logincb={loginSuccessCb} />
  )

  return (
    <div
      className="sign_in_by_google_container"
      style={{
        gap: "1rem",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* <b>Follow these steps:</b> */}
      <center>
        <small style={{ fontWeight: "600", textDecoration: "underline" }}>
          Before you go,
        </small>
      </center>
      <div className="google__login__guide">
        <small>
          <b style={{ color: "#59CE8F" }}>Note: </b>
        </small>
        <span>
          Login through your ReachOut profile's associated email account.
        </span>
      </div>

      {currentState === "loading" ? (
        <button style={{ justifyContent: "center" }}>
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="green.500"
            size="md"
          />
        </button>
      ) : (
        <button onClick={login}>
          <img
            width="30"
            height="30"
            style={{ borderRadius: "8px" }}
            src="data:image/png;base64,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"
          />
          Select google account
        </button>
      )}
      <br />
      <small style={{ opacity: "0.8", fontSize: "0.8rem" }}>
        Don't have profile? create on{" "}
        <Link as={ReactRouterLink} to="/">
          ReachOut App
        </Link>
        .
      </small>
    </div>
  );
}
function MockRazorPayUI({ logincb }) {

  const [formData, setFormData] = React.useState({name: '', password: ''})

  const handleSubmit = () => {

    logincb({access_token: `${formData.name}:${formData.password}`})

  }

  return (

    <Stack p={10} spacing={4}>


  {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
  <InputGroup size='sm'>
    <InputLeftAddon>
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
    </InputLeftAddon>
    <Input placeholder='Username' />
    <InputRightAddon>
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
    </InputRightAddon>
    <Input placeholder='Password' />
  </InputGroup>
    <Button onClick={handleSubmit}>Login</Button>
</Stack>

  )

}
/**
 * @deprecated since [v. Beta] use `SignInByLoginQr` instead.
 **/
function SignInByOTP() {
  const [signInData, setSignInData] = React.useState({
    mode: "email",
    mode_value: "",
    code: "",
    mode_error: false,
    code_error: false,
  });
  const modeValue = signInData.mode_value;
  const codeValue = signInData.code;
  const [status, setStatus] = React.useState({
    loading: false,
    success: "",
    error: "",
    show: false,
  });
  const toast = useToast();

  const validateModeValue = () => {
    if (signInData.mode === "email") {
      return EMAIL_REGEX.test(signInData.mode_value);
    }
    return PHONE_REGEX.test(signInData.mode_value);
  };

  const isSafeForm = () => {
    if (!validateModeValue()) {
      setSignInData((curr) => ({ ...curr, mode_error: true }));
      return false;
    }

    if (signInData.code.length !== 5) {
      setSignInData((curr) => ({
        ...curr,
        mode_error: false,
        code_error: true,
      }));
      return false;
    }

    setSignInData((curr) => ({
      ...curr,
      code_error: false,
      mode_error: false,
    }));

    return true;
  };

  const submitForm = async () => {
    if (isSafeForm()) {
      // alert('Making API CALL');
      setStatus({ ...status, loading: true });

      const response = await fetch(`${BACKEND_ROOT_URL}/auth2/web/login/`, {
        method: "POST",
        withCredntials: true,
        credentials: "include",
        headers: base_json_header,
        body: JSON.stringify({
          mode: signInData.mode,
          mode_value: signInData.mode_value,
          signin_code: signInData.code,
        }),
      });

      if (response.status === 200) {
        const urlParams = new URLSearchParams(window.location.search);
        let nextUrl = urlParams.get("next") ?? false;

        toast({
          title: `Logged In! 😎`,
          status: "success",
          isClosable: true,
        });
        if (nextUrl) {
          // Redirecting back
          nextUrl = decodeURIComponent(nextUrl);
          setStatus({ ...status, loading: false });
          setTimeout(() => {
            window.location.href = nextUrl;
          }, 1000);
          return;
        }
        // Usual flow redirects to webApp page
      } else {
        const dataj = await response.json();
        toast({
          title: dataj["message"],
          status: "error",
          isClosable: true,
        });
        setStatus({ ...status, loading: false });
        return;
      }

      setStatus({ ...status, loading: false });
      setTimeout(() => {
        window.location.href = "/web";
      }, 500);
    }
  };

  React.useEffect(() => {
    if (signInData.mode_error) {
      isSafeForm();
    }

    if (signInData.code_error) {
      isSafeForm();
    }
  }, [modeValue, codeValue]);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const msgCode = urlParams.get("msg_code");

    if (msgCode) {
      const message =
        codeToMessage[msgCode] ?? "Oops! looks like sign in is required.";

      toast({
        description: message,
        status: "info",
        isClosable: true,
      });
    }
  }, []);

  React.useEffect(() => {
    document.title = "SignIn - ReachOut";
  }, []);

  return (
    <>
      <Accordion allowToggle mt={10} mb={8}>
        <AccordionItem
          style={{
            border: "2px solid #59CE8F",
            borderRadius: "8px",
            backgroundColor: "#59CE8F10",
          }}
        >
          <h2>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                <small>Steps to get Sign-In Code:</small>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} fontSize="0.8rem" ml={4}>
            <ul>
              <li>
                Open <b>ReachOut</b> apk, SignIn there if not already.
              </li>
              <li>On home page, Tap your profilePicture/avatar</li>
              <li>
                Select{" "}
                <b>Customization &gt; Web SignIn Code &gt; Generate code</b>,
                Paste generated code below
              </li>
            </ul>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <br />

      <div class="credentials_container">
        <div
          className="input_wrapper"
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <label
            for="SignInEmail"
            style={{ position: "absolute", top: "-50%", fontSize: "0.8rem" }}
          >
            Email
          </label>

          {signInData.mode === "email" && signInData.mode_error && (
            <b
              style={{
                position: "absolute",
                top: "100%",
                fontSize: "0.8rem",
                color: "tomato",
              }}
            >
              <small>
                Try <code>email@domain.xyz </code> format{" "}
              </small>
            </b>
          )}

          <input
            onFocus={(e) => {
              setSignInData({
                ...signInData,
                mode: "email",
                mode_value: e.target.value,
              });
            }}
            onChange={(e) => {
              console.log("asd", e.target.value);
              signInData.mode === "email" &&
                setSignInData((c) => ({ ...c, mode_value: e.target.value }));
            }}
            type="email"
            name="email"
            placeholder="email@domain.com"
            id="SignInEmail"
          />
        </div>
        <center
          style={{ color: "#494949", fontSize: "0.7rem" }}
          onClick={() => {
            alert(signInData.mode_value);
          }}
        >
          or
        </center>
        <div
          className="input_wrapper"
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <label
            for="SignInPhoneNo"
            style={{ position: "absolute", top: "-50%", fontSize: "0.8rem" }}
          >
            Phone No
          </label>
          {signInData.mode === "phone" && signInData.mode_error && (
            <b
              style={{
                position: "absolute",
                top: "100%",
                fontSize: "0.8rem",
                color: "tomato",
              }}
            >
              <small>
                Try <code>+91 12345-67890 </code> format{" "}
              </small>
            </b>
          )}
          <input
            onFocus={(e) => {
              setSignInData({
                ...signInData,
                mode: "phone",
                mode_value: e.target.value,
              });
            }}
            onChange={(e) => {
              signInData.mode === "phone" &&
                setSignInData((c) => ({ ...c, mode_value: e.target.value }));
            }}
            type="text"
            name="phone_no"
            placeholder="+91 12345-67890"
            id="SignInPhoneNo"
          />
        </div>
      </div>
      <small>
        <b>Sign-In Code</b>
      </small>
      <div class="submission_container">
        <HStack style={{ position: "relative" }}>
          <PinInput
            onChange={(newVal) => {
              setSignInData({ ...signInData, code: newVal });
            }}
            type="alphanumeric"
          >
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField
              onKeyUp={({ key: pressedKey }) => {
                if (pressedKey === "Enter") {
                  submitForm();
                }
              }}
            />
          </PinInput>
          {signInData.code_error && (
            <b
              for="SignInPhoneNo"
              style={{
                position: "absolute",
                top: "100%",
                fontSize: "0.8rem",
                color: "tomato",
              }}
            >
              <small>Please provide valid code.</small>
            </b>
          )}
        </HStack>
        <Button
          isLoading={status.loading}
          onClick={submitForm}
          colorScheme={"whatsapp"}
          variant="solid"
          style={{ padding: "0.5rem 1rem " }}
        >
          {" "}
          <small>Link Profile</small>&nbsp;
          <svg
            width="15"
            height="15"
            viewBox="0 0 35 35"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19.0085 7.34172C19.4641 6.88609 20.2028 6.88609 20.6584 7.34172L29.9918 16.6751C30.4473 17.1307 30.4473 17.8693 29.9918 18.325L20.6584 27.6584C20.2028 28.1139 19.4641 28.1139 19.0085 27.6584C18.5528 27.2027 18.5528 26.464 19.0085 26.0083L26.3502 18.6667H5.83341C5.18909 18.6667 4.66675 18.1443 4.66675 17.5C4.66675 16.8557 5.18909 16.3333 5.83341 16.3333H26.3502L19.0085 8.99162C18.5528 8.53602 18.5528 7.79733 19.0085 7.34172Z"
              fill={useColorModeValue("white", "black")}
            />
          </svg>
        </Button>
      </div>
    </>
  );
}

function SignInByLoginQr() {
  const {
    isOpen: showDiscontinuedMessage,
    onClose: onCloseDiscontinuedMessage,
  } = useDisclosure({ defaultIsOpen: true });

  return (
    <>
      <br />
      {showDiscontinuedMessage && (
        <Alert
          status="success"
          variant={"left-accent"}
          borderRadius={"5px"}
          alignItems={"center"}
        >
          <AlertTitle fontSize={"0.7rem"}>NOTE: </AlertTitle>
          <AlertDescription fontSize={"0.75rem"} lineHeight={"1rem"}>
            {" "}
            website login by `SignIn code` was discontinued from 12 Oct. 2023
            onwards.
          </AlertDescription>
          <CloseButton
            alignSelf="flex-start"
            position="relative"
            marginLeft={"auto"}
            right={-1}
            top={-1}
            onClick={onCloseDiscontinuedMessage}
          />
        </Alert>
      )}

      <br />
      <Flex alignItems={"center"} gap={"1rem"} flexWrap={"wrap"}>
        <div style={{ flex: "1", minWidth: "300px" }}>
          <small>
            <b>Steps:</b>
          </small>
          <ol style={{ fontSize: "0.85rem", marginLeft: "1rem" }}>
            <li><b>Open</b> your <b>ReachOut app.</b> on mobile.</li>
            <li>Tap on your profile picture to <b>open sidebar</b>.</li>
            <li>Tap on <b>`Scan QR`</b>.</li>
            <li>Scan shown QR on this screen.</li>
            <li>Wait a moment to complete 😉.</li>
          </ol>
        </div>

        <LoginQR />
      </Flex>
    </>
  );
}
/*
Initiate Session: tries to retrive things necessary for starting session
[If all things retrieved successfully, Then::]
Start Session: Does after protocol things
*/
function IsOtherActiveSessionRunning(windowInstance) {
  /**
   * Checks if any parallel sessions running by looking at written values to localStorage
   * @param  {Window} window
   * @return {[Boolean]} Weather any other concurrent active sessions running or not.
   */

  let activeSession = windowInstance.localStorage.getItem("activeSession");
  let currentSession = windowInstance.sessionStorage.getItem("currentSession");

  if (
    activeSession !== null &&
    activeSession.split(":").length > 1 &&
    Date.now() - (parseInt(activeSession.split(":")[1]) || 0) <=
      LOGIN_QR_SESSION_TIMEOUT
  ) {
    // SOME SESSION IS RUNNING NOW JUST NEED TO CHECK IF ITS CURRENT ONE OR NOT
    if (activeSession === currentSession) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

const stateToQrStateComponent = {
  ready: <LoginQrReady />,
  loading: <LoginQrLoading />,
  generated: <LoginQrGenerated />,
  suspended: <LoginQrSuspended />,
  unavailable: <LoginQrUnavailable />,
};

function LoginQR() {
  /*
  Required handler functions  for backend
  In case of pooling sessions between tabs, we consider both valid even after being pooled by other tab (or until epochs ran out of threshold time).
   - Initiate session GET (/auth2/session/)
    * Tries to get available session. if not available reply with 404 | 200 + addon_data
    * data should contain [sessionKey:epochs, error, message]
   - Get Login Qr GET (/auth2/session/qr)
    * pass along parameters: (sessionKey)
   - Listen Session QR GET (/auth2/session/listen/<session_id_without_epochs_or_metadata>)
    * pass along parameters: (sessionKey)
   - Terminate session DELETE (/auth2/session/) [also as BEACON_REQUEST]
    * This is automatically triggered by the browser when client unfocuses the screen
    * Also manually called when 5 minutes + 10 seconds (WORST_CLIENT_SYN_TIME*2) passed and auto triggers Initiate session aftewards
    * 
  */
  // Generate new QR
  const {
    state: currentState,
    session: currentSession,
    set_state: setCurrentState,
  } = React.useContext(LoginQrContext);

  const preventConcurrentSessions = () => {
    // FUnction to check using localStorage and sessionStorage? and show dialogue for Pull session (if necessary)
    // Only we need to prevent this session if
    /**
     * If (localStorage.activeSession):
     *   if(localStorage.activeSession.epochs < 5mins)
     *     if(sessionStorage.currentSession):
     *         if(localStorage.activeSession.id != sessionStorage.currentSession.id) PULL?
     *     else:
     *       PULL?
     *
     */
  };


  return (
    <Container
      border={`1px solid ${
        currentState === "suspended" || currentState === "unavailable"
          ? "#FF8080"
          : "#A8A19660"
      }`}
      h={"200px"}
      w={"200px"}
      borderRadius={"10px"}
    >
      <AnimatePresence mode="wait">
        {stateToQrStateComponent[currentState]}
      </AnimatePresence>
    </Container>
  );
  // GenerateQR | Generating | ShowQR
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Login Qr VARIANTS
function LoginQrReady() {
  const { set_state: setCurrentState, state: currentState, set_qr_image } = React.useContext(LoginQrContext);
  const toast = useToast();

  const generateQr = async (currentSessionId) => {
    console.log('[MOCK] fetching login qr...', )
    if(currentState === 'generated' || currentState === 'ready'){
      setCurrentState("loading");
  
      // make api request, faking response ;)
      // await sleep(2000);
      const response = await axios.get(`/auth2/login_qr_session/qr/${currentSessionId}`)
      // let status = 200;
      // let data = { qr_image_data: `data:image/png;base64,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`}; // null indicates no available sessions!
      //  update qr with this data
      if(response.status === 200){
        console.log("This is Recieved QR data: ", response.data.qr_image_data)
  
        set_qr_image(response.data.qr_image_data);
        setCurrentState('generated')
      } else {
        // TODO: need to handle this...
        setCurrentState('error')
      }
    }else {
      // Either suspended or sessionsAreFull
      // Skip to re generate it!
    }
  }

  const destroySession = async () => {

    axios.delete(`/auth2/login_qr_session/terminate/${sessionStorage.getItem('currentSession').split(':')[0]}`)

  }

  const listenHandler = (axiosResponse) => {
    console.log('Empty logger::', axiosResponse)
    // Check the response code
    if(axiosResponse.status === 200){
      // User is logged in
      const urlParams = new URLSearchParams(window.location.search);
      let nextUrl = urlParams.get("next") ?? false;

      toast({
        title: `Logged In! 😎`,
        status: "success",
        isClosable: true,
      });
      if (nextUrl) {
        // Redirecting back
        nextUrl = decodeURIComponent(nextUrl);
        setTimeout(() => {
          window.location.href = nextUrl;
        }, 1000);
        return;
      }
      setTimeout(() => {
        window.location.href = "/web";
      }, 500);
    } else if (axiosResponse.status === 400) {

      if(axiosResponse.data.message === 'session_timeout') {
        // 5 minutes has passed
        toast({
          status: 'error',
          title: "Anyone there?...",
          description: 'Looks like no QR scans...',
          isClosable: true,
          duration: 9000
        });
        setCurrentState("ready");

      } else if(axiosResponse.data.message === 'already_listened'){
        // Someone already listening to that QR, SUS!!
        // Let client know to open this URL in new TAB
        toast({
          status: 'error',
          title: "Attention!",
          description: 'Please open this page in new tab for security reasons!',
          isClosable: true,
          duration: 9000
        });
        setCurrentState("ready");
      }
      toast({
        status: 'error',
        title: "Oops",
        description: 'Something went wrong',
        isClosable: true,
        duration: 9000
      });
      setCurrentState("ready");


    } else {
      // Status code 500
      toast({
        status: 'error',
        title: "Try again later!",
        description: 'Something went wrong',
        isClosable: true,
        duration: 9000
      })
      setCurrentState('ready')
    }

    // Make a request to server to destroy session
    destroySession();

  }

  const initiateSession = async () => {
    // update ui to "loading"
    setCurrentState("loading");

    // make api request
    // await sleep(2000);
    // let status = 200;
    const create_session_response = await axios.get(`/auth2/login_qr_session/create/`)
    
    if(create_session_response.status !== 200){
      if(create_session_response.data.message === 'login_sessions_full'){
        setCurrentState("unavailable");
      } else {
        setCurrentState("error");
      }
      return;
    }
    
    /*
    We either move above request and hanler to function and trigger it also when session been awaked
    */
    // const generate_qr_response = await axios.get(`/auth2/login_qr_session/qr/`)

    // let data = { session: `ev23djd389r394ury4ufheruyf43${Date.now().toString()}:1697519509` }; // null indicates no available sessions!
    // let status = 200;
    // if sessions are full (or no sessions available): update ui "unavailable"
    let qrGeneratorTimerId;
    if (create_session_response.status === 200) {
      // setCurrentState('generate')
      /*
      RepeatTimer: every x seconds, 
      */
      generateQr(create_session_response.data.session.split(':')[0]);
      /**
       * Now that first QR is generated, we can listen to sessionChanges to server by long pooling
       */
      qrGeneratorTimerId = setInterval(() => {generateQr(create_session_response.data.session.split(':')[0])}, LOGIN_QR_EXPIRY_TIME*1000);

      // setting this in context

      setTimeout(() => { 
        console.log('clearing')
        clearInterval(qrGeneratorTimerId);
        setCurrentState('ready')
      }, LOGIN_QR_SESSION_TIMEOUT*1000-1000)// Subtracting markable amount of 1second to avoid collision

      
      /*
      *
       * Collision scenario *
       * G - GenerateQr (manual call)
       * C - ClearInterval called by setTimeout
       * I - Interval called every defined second to execute g()
       * 
       * Timeline per second
       * -----1-----2-----3-----4-----5
       *      I     I     I     I     I |
       * G                              | -> I and C getting called at same time (collision), to avoid it, we padded c some time leftwards (subtracting noticable amount ex.. 1sec)
       *                              C |    (another solution: a counter value, if its below some threshold, generate qr otherwise return to "ready" state)
       */


    } 

    // sync values with sessionStorage
    sessionStorage.setItem('currentSession', create_session_response.data.session);

    // check for any other concurrent (ongoing) sessions running or not.
    // let needToPullSession = IsOtherActiveSessionRunning(window);

    // if (needToPullSession) {
    //   console.log('Need to Pull')
    //   // suspend current one and ask user permission to make current session as active and other inactive
    //   setCurrentState("suspended");
    //   return;
    // }

    // sync value with localStorage because needToPullSession === false
    localStorage.setItem('activeSession', create_session_response.data.session)
    // add storage Value listener: attach to check IsOtherActive if ? update ui "suspended": then call immediatePullSession()
    const listen_login_qr_controller = new AbortController();
    
    window.addEventListener('storage', (event) => {
      if(event.key === 'activeSession'){
        // Stop listening (abort Controller)...
        // Stop listening to changes from server
        listen_login_qr_controller.abort();
        //  clear TimeOut
        clearInterval(qrGeneratorTimerId);
        setCurrentState("suspended");
      }
    })

    // document.addEventListener("visibilitychange", function terminateSession() {
    //   if (document.visibilityState === "hidden") {
    //     console.info('Auto terminating session...');
    //     const res = navigator.sendBeacon(`${BACKEND_ROOT_URL}/auth2/login_qr_session/terminate/${create_session_response.data.session.split(':')[0]}/`);
    //     console.log("My result::")
    //     console.log(res)
    //   }
    // });
    /**TODO: Just destroy TimeOut/Interval after terminating session or resolving session! */

    console.log("LISTENNING>>>>>......")
    // Below request may delay more (max 5 minutes) once it got response it'll react according to status code
    const listen_session_response = await coreAxios.post(`${BACKEND_ROOT_URL}/auth2/login_qr_session/listen/${create_session_response.data.session.split(':')[0]}/`, {}, {signal: listen_login_qr_controller.signal, withCredentials: true})

    clearInterval(qrGeneratorTimerId);

    listenHandler(listen_session_response);
    
  };

  return (
    <motion.div
      key="generate"
      whileTap={{ scale: 0.95 }}
      style={{
        width: "100%",
        height: "calc(100% - 2rem)",
        margin: "1rem 0",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Button
        display={"flex"}
        onClick={initiateSession}
        fontWeight={"400"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        colorScheme="whatsapp"
        fontSize={"12px"}
        w="100%"
        h={"100%"}
      >
        <IoQrCode size={20} />
        <br />
        Click to generate
      </Button>
    </motion.div>
  );
}
function LoginQrLoading() {
  const { set_state: setCurrentState } = React.useContext(LoginQrContext);

  return (
    <motion.div
      key="generating"
      style={{
        width: "100%",
        height: "calc(100% - 2rem)",
        margin: "1rem 0",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container
        display={"flex"}
        onClick={() => {
          setCurrentState("generated");
        }}
        h="100%"
        w="100%"
        fontWeight={"400"}
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        fontSize={"12px"}
      >
        <CircularProgress isIndeterminate color="#59CE8F" />
      </Container>
    </motion.div>
  );
}
function LoginQrGenerated() {
  const { qr_image, set_state: setCurrentState } =
    React.useContext(LoginQrContext);

  return (
    <motion.div
      key="generated"
      style={{ maxWidth: "100%", height: "100%" }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Center
        h="100%"
        onClick={() => {
          setCurrentState("generate");
        }}
      >
        <img
          style={{ maxWidth: "100%", maxHeight: "100%" }}
          src={qr_image}/>
      </Center>
    </motion.div>
  );
}
function LoginQrSuspended() {
  
  const { set_state: setCurrentState } = React.useContext(LoginQrContext);

  const makeCurrentSessionPrimary = () => {
    setCurrentState('ready')
    /*
    Expectations: 
      1. locally sync values such that current session is set to localStorage
      2. update sessionSuspended

    Procedure: 
      - Assert there is currentSession exists (sessionStorage.currentSession && .epochs < 5min)
    */
  };

  return (
    <motion.div
      key="generate"
      style={{
        width: "100%",
        height: "calc(100% - 2rem)",
        margin: "1rem 0",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        gap: "10px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        style={{
          flex: "1",
          fontSize: "0.75rem",
          textAlign: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <TbAlertTriangleFilled color="red" size={22} />
        Looks like another session running on different tab.
      </div>
      <Button
        onClick={makeCurrentSessionPrimary}
        _hover={{
          bgColor: "transparent",
          boxShadow: "0 0 0 1px #D80032",
          color: "#D80032",
        }}
        color={"white"}
        fontSize={12}
        bg={"#D80032"}
      >
        Start new here
      </Button>
    </motion.div>
  );
}
function LoginQrUnavailable() {
  const { set_state: setCurrentState } = React.useContext(LoginQrContext);

  const tryAgain = async () => {
    setCurrentState("ready");
  };

  return (
    <motion.div
      key="generate"
      style={{
        width: "100%",
        height: "calc(100% - 2rem)",
        margin: "1rem 0",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        gap: "10px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        style={{
          flex: "1",
          fontSize: "0.75rem",
          textAlign: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <TbAlertTriangleFilled color="red" size={22} />
        No empty sessions available currently!
      </div>
      <Button
        onClick={tryAgain}
        _hover={{
          bgColor: "transparent",
          boxShadow: "0 0 0 1px #D80032",
          color: "#D80032",
        }}
        color={"white"}
        fontSize={12}
        bg={"#D80032"}
      >
        Try again
      </Button>
    </motion.div>
  );
}
function LoginQrError() {
  const { set_state: setCurrentState } = React.useContext(LoginQrContext);

  const tryAgain = async () => {
    setCurrentState("ready");
  };

  return (
    <motion.div
      key="generate"
      style={{
        width: "100%",
        height: "calc(100% - 2rem)",
        margin: "1rem 0",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        gap: "10px",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        style={{
          flex: "1",
          fontSize: "0.75rem",
          textAlign: "center",
          display: "grid",
          placeItems: "center",
        }}
      >
        <TbAlertTriangleFilled color="red" size={22} />
        Oops! something went wrong...
      </div>
      <Button
        onClick={tryAgain}
        _hover={{
          bgColor: "transparent",
          boxShadow: "0 0 0 1px #D80032",
          color: "#D80032",
        }}
        color={"white"}
        fontSize={12}
        bg={"#D80032"}
      >
        Try again
      </Button>
    </motion.div>
  );
}

export default SignIn;
// useGoogleOneTapLogin({
//     onSuccess: (response) => {console.log('Hahahah');console.log(response)},
//     onError: (response) => {console.log('Hahahah');console.log(response)},
//     googleAccountConfigs: {
//         client_id: '85619004436-enpfc7ca57gvjmo4ee2ecno3gi2c635b.apps.googleusercontent.com'
//     }

//  })
