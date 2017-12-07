import { observable } from 'mobx';

class UiStore {
  @observable showBuddyForm = false;
  @observable showChat = false;
  @observable showAnswerCall = false;
  @observable callInProgress = false;
  @observable loginFormError = null;
  @observable signupFormErrors = null;

  @observable visualImageVisible = false;
  @observable visualImagePositionX = null;
  @observable visualImagePositionY = null;
  @observable visualImageStop = null;
  @observable showSelected = 'stops';
}

const singleton = new UiStore();
export default singleton;
