import { createSlice } from "@reduxjs/toolkit";
import { HOST } from "../../../constants";
import axios from "axios";

const registrationSlice = createSlice({
  name: "registration",
  initialState: {
    signupProvider: "",
    verify: "",
    basicInfo: "" as any,
    serviceDetail: "" as any,
    profileDetails: "" as any,
  },
  reducers: {
    signupProvider: (state, action) => {
      return {
        ...state,
        signupProvider: action.payload,
      };
    },
    verifyCode: (state, action) => {
      return {
        ...state,
        verify: action.payload,
      };
    },
    basicInfo: (state, action) => {
      return {
        ...state,
        basicInfo: {
          ...state.basicInfo,
          ...action.payload,
        },
      };
    },
    serviceDetail: (state, action) => {
      return {
        ...state,
        serviceDetail: {
          ...state.serviceDetail,
          ...action.payload,
        },
      };
    },
    profileDetails: (state, action) => {
      return {
        ...state,
        profileDetails: {
          ...state.profileDetails,
          ...action.payload,
        },
      };
    },
  },
});

export default registrationSlice.reducer;

const { signupProvider, verifyCode, basicInfo, serviceDetail, profileDetails } =
  registrationSlice.actions;

export const providerSignup = (data) => async (dispatch) => {
  try {
    dispatch(signupProvider({ error: false, loading: true }));
    await axios({
      method: "post",
      data,
      url: HOST + `/api/provider/signup`,
    })
      .then((response) => {
        //handle success
        let data = response.data;
        data.loading = false;
        dispatch(signupProvider(response.data));
      })
      .catch((error) => {
        //handle error
        let data = error.response.data;
        data.loading = false;
        dispatch(signupProvider(error.response.data));
      });
  } catch (error) {
    dispatch(
      signupProvider({
        error: true,
        loading: false,
        message: "something went wrong!",
      })
    );
  }
};

export const verifyEmail = (data) => async (dispatch) => {
  try {
    dispatch(verifyCode({ error: false, loading: true }));
    await axios({
      method: "post",
      data,
      url: HOST + `/api/provider/signup/email/verify`,
    })
      .then((response) => {
        //handle success
        let data = response.data;
        data.loading = false;
        dispatch(verifyCode(response.data));
      })
      .catch((error) => {
        //handle error
        let data = error.response.data;
        data.loading = false;
        dispatch(verifyCode(error.response.data));
      });
  } catch (error) {
    dispatch(
      verifyCode({
        error: true,
        loading: false,
        message: "something went wrong!",
      })
    );
  }
};

export const postBasicInfo = (data) => async (dispatch) => {
  try {
    dispatch(basicInfo({ error: false, loading: true }));
    await axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("providerToken")}`,
      },
      data,
      url: HOST + `/api/provider/signup/name`,
    })
      .then((response) => {
        //handle success
        let data = response.data;
        data.loading = false;
        dispatch(basicInfo(response.data));
      })
      .catch((error) => {
        //handle error
        let data = error.response.data;
        data.loading = false;
        dispatch(basicInfo(error.response.data));
      });
  } catch (error) {
    dispatch(
      basicInfo({
        error: true,
        loading: false,
        message: "something went wrong!",
      })
    );
  }
};

export const postServiceDetails = (data) => async (dispatch) => {
  try {
    dispatch(serviceDetail({ error: false, loading: true }));
    await axios({
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("providerToken")}`,
      },
      data,
      url: HOST + `/api/provider/signup/my-services`,
    })
      .then((response) => {
        //handle success
        let data = response.data;
        data.loading = false;
        dispatch(serviceDetail(response.data));
      })
      .catch((error) => {
        //handle error
        let data = error.response.data;
        data.loading = false;
        dispatch(serviceDetail(error.response.data));
      });
  } catch (error) {
    dispatch(
      serviceDetail({
        error: true,
        loading: false,
        message: "something went wrong!",
      })
    );
  }
};

export const postProfileDetail = (data) => async (dispatch) => {
  try {
    dispatch(profileDetails({ error: false, loading: true }));
    await axios({
      method: "post",
      headers: {
        contentType: "multipart/form-data",
        Authorization: `${localStorage.getItem("providerToken")}`,
      },
      data,
      url: HOST + `/api/provider/signup/profile`,
    })
      .then((response) => {
        //handle success
        let data = response.data;
        data.loading = false;
        dispatch(profileDetails(response.data));
      })
      .catch((error) => {
        //handle error
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.href = "/";
        }
        let data = error.response.data;
        data.loading = false;
        dispatch(profileDetails(error.response.data));
      });
  } catch (error) {
    dispatch(
      profileDetails({
        error: true,
        loading: false,
        message: "something went wrong!",
      })
    );
  }
};
