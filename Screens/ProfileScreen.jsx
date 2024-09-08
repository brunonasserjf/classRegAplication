import { StyleSheet, Text, View, Button } from "react-native";

function ProfileScreen(props){
    console.log(props);
    return (
        <View style={styles.viewStyle}>
            <Text style={styles.textStyle}>This is Profile Screen</Text>
            <Button 
                title="User" 
                onPress={() => props.navigation.navigate('User')}></Button>
        </View>
    );
}

const styles = StyleSheet.create({
    viewStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    textStyle: {
        fontSize: 20,
        color: 'black',
    },
    headingStyle: {
        fontSize: 28,
        color: 'black',
        textAlign: 'center',
    }
});

export default ProfileScreen;