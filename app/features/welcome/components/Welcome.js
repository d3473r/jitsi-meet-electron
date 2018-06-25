// @flow

import Button from '@atlaskit/button';
import { FieldTextStateless } from '@atlaskit/field-text';
import Page from '@atlaskit/page';
import { AtlasKitThemeProvider } from '@atlaskit/theme';

import React, { Component } from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Navbar } from '../../navbar';

import { WelcomeWrapper as Wrapper, Content, Form } from '../styled';


type Props = {

    /**
     * Redux dispatch.
     */
    dispatch: Dispatch<*>;
};

type State = {

    /**
     * URL of the room to join.
     * If this is not a url it will be treated as room name for default domain.
     */
    url: string;
};

/**
 * Welcome Component.
 */
class Welcome extends Component<Props, State> {
    /**
     * Initializes a new {@code Welcome} instance.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this.state = {
            url: ''
        };

        // Bind event handlers.
        this._onURLChange = this._onURLChange.bind(this);
        this._onFormSubmit = this._onFormSubmit.bind(this);
        this._onJoin = this._onJoin.bind(this);
    }

    /**
     * Render function of component.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <Page navigation = { <Navbar /> }>
                <AtlasKitThemeProvider mode = 'light'>
                    <Wrapper>
                        <Content>
                            <Form onSubmit = { this._onFormSubmit }>
                                <FieldTextStateless
                                    autoFocus = { true }
                                    isLabelHidden = { true }
                                    onChange = { this._onURLChange }
                                    shouldFitContainer = { true }
                                    type = 'text'
                                    value = { this.state.url } />
                            </Form>
                            <Button
                                appearance = 'primary'
                                onClick = { this._onJoin }
                                type = 'button'>
                                GO
                            </Button>
                        </Content>
                    </Wrapper>
                </AtlasKitThemeProvider>
            </Page>
        );
    }

    _onFormSubmit: (*) => void;

    /**
     * Prevents submission of the form and delegates the join logic.
     *
     * @param {Event} event - Event by which this function is called.
     * @returns {void}
     */
    _onFormSubmit(event: Event) {
        event.preventDefault();
        this._onJoin();
    }

    _onJoin: (*) => void;

    /**
     * Redirect and join conference.
     *
     * @returns {void}
     */
    _onJoin() {
        const inputURL = this.state.url;
        const lastIndexOfSlash = inputURL.lastIndexOf('/');
        let room;
        let serverURL;

        if (lastIndexOfSlash === -1) {
            // This must be only the room name.
            room = inputURL;
        } else {
            // Take the substring after last slash to be the room name.
            room = inputURL.substring(lastIndexOfSlash + 1);

            // Take the substring before last slash to be the Server URL.
            serverURL = inputURL.substring(0, lastIndexOfSlash);

            // If no protocol is specified in the input we assume and append
            // the HTTPS protocol scheme.
            if (serverURL.indexOf('://') === -1) {
                serverURL = `https://${serverURL}`;
            }
        }

        // Don't navigate if no room was specified.
        if (!room) {
            return;
        }

        this.props.dispatch(push('/conference', {
            room,
            serverURL
        }));
    }

    _onURLChange: (*) => void;

    /**
     * Keeps URL input value and URL in state in sync.
     *
     * @param {SyntheticInputEvent<HTMLInputElement>} event - Event by which
     * this function is called.
     * @returns {void}
     */
    _onURLChange(event: SyntheticInputEvent<HTMLInputElement>) {
        this.setState({
            url: event.currentTarget.value
        });
    }
}

export default connect()(Welcome);