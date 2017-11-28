import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import {
  Form,
  InputWrapper,
  Label,
  Input,
  ActionsContainer,
  Action,
  BuddyFormContainer
} from '../elements/form';

@inject('WanderersStore')
@observer
export default class BuddyForm extends Component {
  submitForm = e => {
    e.preventDefault();
    this.props.WanderersStore.sendInvitation(this.emailInput.value);
    e.target.reset();
  };

  render() {
    return (
      <BuddyFormContainer>
        <Form onSubmit={e => this.submitForm(e)}>
          <InputWrapper>
            <Label htmlFor="email" className="input-label">
              Invite a Friend
            </Label>
            <Input
              innerRef={input => (this.emailInput = input)}
              type="email"
              className="input-field"
              name="email"
              id="email"
              placeholder="EMAIL"
              required
            />
          </InputWrapper>

          <ActionsContainer>
            <Action type="submit">SEND</Action>
            <Action>CANCEL</Action>
          </ActionsContainer>
        </Form>
      </BuddyFormContainer>
    );
  }
}
