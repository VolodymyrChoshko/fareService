import { combineReducers } from "redux";
import HeaderMenuSlice from "./Slices/HeaderMenuSlice";
import FooterSlice from "./Slices/footer";
import userSclice from "./Slices/UserSlice";
import serviceSclice from "./Slices/services/ServiceSclice";
import requestServiceSlice from "./Slices/services/RequestServiceSclice";
import providerSclice from "./Slices/providers/providerListSclice";
import registrationSlice from "./Slices/providers/registration";
import providerProfileSclice from "./Slices/providers/ProviderProfileSclice";
import providerSchedule from "./Slices/providers/providerScheduleSclice";
import chatlistSclice from "./Slices/chat/chatlistSclice";
import messageListSclice from "./Slices/chat/messageListSclice";
import messageSlice from "./Slices/chat/messageSlice";
import paymentSlice from "./Slices/payments/paymentSlice";
import feedbackSlice from "./Slices/feedbacks/feedbackSlice";
import movingSlice from "./Slices/moving/movingSlice";
import restaurantsSlice from "./Slices/restauransts/restaurantsSlice";
import cartsSlice from "./Slices/cart/cartsSlice";
import orderSlice from "./Slices/order/orderSlice";
import groceryStoreSlice from "./Slices/grocery/groceryStoreSlice";
import categorySlice from "./Slices/category/index";
import notificationSlice from "./Slices/notification";
import commonSlice from "./Slices/common";
import QuestionAnswersSlice from "./Slices/services/QuestionAnswersSlice";
import blogSlice from "./Slices/blog/blogSlice";

const reducers = combineReducers({
  commonReducer: commonSlice,
  headerMenuReducer: HeaderMenuSlice,
  footerReducer: FooterSlice,
  userReducer: userSclice,
  service: serviceSclice,
  serviceRequest: requestServiceSlice,
  questionAnswers: QuestionAnswersSlice,
  provider: providerSclice,
  providerProfile: providerProfileSclice,
  providerSchedule: providerSchedule,
  chatlistReducer: chatlistSclice,
  messageListReducer: messageListSclice,
  messageReducer: messageSlice,
  paymentReducer: paymentSlice,
  feedbackReducer: feedbackSlice,
  movingReducer: movingSlice,
  restaurantsReducer: restaurantsSlice,
  groceryStoreReducer: groceryStoreSlice,
  cartsReducer: cartsSlice,
  orderReducer: orderSlice,
  categoryReducer: categorySlice,
  registrationReducer: registrationSlice,
  notificationReducer: notificationSlice,
  blogReducer: blogSlice
});

export default reducers;
