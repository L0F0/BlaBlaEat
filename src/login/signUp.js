import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { mapping } from '@eva-design/eva';
import { light as lightTheme } from '@eva-design/eva';
import { ApplicationProvider, Layout, Input, Icon, Text, Button } from 'react-native-ui-kitten';

const styles = StyleSheet.create({
    input: {
      marginHorizontal: 4,
      width: '70%',
      marginTop: '5%'   
    },
    button: {
        marginVertical: 4,
        marginHorizontal: 4,
        width: '70%',
        marginTop: '5%'
    },
});

export default class SignUp extends Component {
    state = {
        fName: "",
        lName: "",
        email: "",
        password: "",
        visiblePassword: true,
    }

    onChangeFName = (fName) => {
        this.setState({ fName });
    }
    onChangeLName = (lName) => {
        this.setState({ lName });
    }

    onChangeEmail = (email) => {
        this.setState({ email });
    }
    
    onChangePassword = (password) => {
        this.setState({ password });
    };

    onIconPress = () => {
      const visiblePassword = !this.state.visiblePassword;
      this.setState({ visiblePassword });
    };

    renderIcon = (style) => {
      const iconName = this.state.visiblePassword ? 'eye-off' : 'eye';
      return (
        <Icon name={iconName}/>
      );
    };

    render() {
        return (
            <ApplicationProvider mapping={mapping} theme={lightTheme}>
                <Layout style={{height:'100%'}}>
                    <View style={{flex: 2, alignItems: 'center', marginTop: "30%"}}>
                        <Input
                            style={styles.input}
                            value={this.state.fName}
                            onChangeText={this.onChangeFName}
                            placeholder='First name'
                        />
                        <Input
                            style={styles.input}
                            value={this.state.lName}
                            onChangeText={this.onChangeLName}
                            placeholder='Last name'
                        />
                        <Input
                            style={styles.input}
                            value={this.state.email}
                            onChangeText={this.onChangeEmail}
                            placeholder='email'
                        />
                        <Input
                            style={styles.input}
                            value={this.state.password}
                            placeholder='password'
                            icon={this.renderIcon}
                            secureTextEntry={this.state.visiblePassword}
                            onIconPress={this.onIconPress}
                            onChangeText={this.onChangePassword}
                        />
                        <Button style={styles.button} status='info'>SUBMIT</Button>
                    </View>
                </Layout>
            </ApplicationProvider>
        )
    }
}