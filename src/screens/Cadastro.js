import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native';
import { Button } from 'react-native-paper'
import Logo from '../components/Logo.js';
import { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';


export default function Cadastro({navigation}){
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Masculino', value: 'masculino' },
        { label: 'Feminino', value: 'feminino' },
        { label: 'Outro', value: 'outro' },
    ]);
    return(
        <View style={styles.container}>
            <Logo />
            <View style={{margin:20, height:'80%'}}>
                <ScrollView>
                    <Text style={{alignSelf:'center', fontSize: 19}}>Dados Pessoais</Text>
                    <View
                        style={{
                            height: 1,
                            backgroundColor: '#000',
                            width: 100,
                            alignSelf: 'center',
                            marginVertical: 5,
                        }}
                    />
                    <Text style={styles.label}>Nome:</Text>
                    <TextInput style={styles.input}></TextInput>
                    <Text style={styles.label}>Sobrenome:</Text>
                    <TextInput style={styles.input}></TextInput>
                    <Text style={styles.label}>Data de Nascimento:</Text>
                    <View style={{flexDirection:'row', gap: 10}}>
                        <TextInput style={{...styles.input, width: 50, textAlign: 'center'}} placeholder='DD'></TextInput>
                        <TextInput style={{...styles.input, width: 50, textAlign:'center'}} placeholder='MM'></TextInput>
                        <TextInput style={{...styles.input, width: 80, textAlign:'center'}} placeholder='AAAA'></TextInput>
                    </View>
                    <Text style={styles.label}>Gênero:</Text>
                    <DropDownPicker style={styles.input}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder="Selecionar"
                        listMode="SCROLLVIEW"
                        dropDownContainerStyle={{
                            backgroundColor: 'none',
                            borderWidth: 0,
                            borderRadius: 20,
                            width: 200,
                            marginHorizontal: 5
                            
                        }}

                        // Estilo de cada item da lista
                        listItemContainerStyle={{
                            backgroundColor: 'none',
                            borderWidth: 0,
                            borderRadius: 20,
                            width: 200,
                            height: 45
                        }}

                        // Estilo do texto de cada item
                        listItemLabelStyle={{
                            color: '#333',
                            fontSize: 14,
                        }}

                        selectedItemLabelStyle={{
                            color: '#6200ee',
                            fontWeight: 'bold',
                        }}

                        // Estilo do placeholder
                        placeholderStyle={{
                            color: 'grey',
                        }}

                        // Estilo da seta
                        arrowIconStyle={{
                            tintColor: '#6200ee',
                        }}
                    />
                    <Text style={{alignSelf:'center', fontSize: 19,  marginTop: 20}}>Dados Cadastrais</Text>
                    <View
                        style={{
                            height: 1,
                            backgroundColor: '#000',
                            width: 100,
                            alignSelf: 'center',
                            marginVertical: 5,
                        }}
                    />
                    <Text style={styles.label}>Email:</Text>
                    <TextInput style={styles.input}></TextInput>
                    <Text style={styles.label}>Usuário:</Text>
                    <TextInput style={styles.input}></TextInput>
                    <Text style={styles.label}>Senha:</Text>
                    <TextInput style={styles.input}></TextInput>
                    <Text style={styles.label}>Confirmar Senha:</Text>
                    <TextInput style={styles.input}></TextInput>
                </ScrollView>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center', gap: 35}}>
                <Button mode='elevated' textColor='black' buttonColor='#bfecff' style={{width: 150}} onPress={() => navigation.goBack()}>Voltar</Button>
                <Button mode='elevated' textColor='white' buttonColor='#6446db' style={{width: 150}}>Salvar</Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 20,
        backgroundColor: '#EEEEEE'
    },
    input:{
        width: 200,
        height: 45,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10, 
        borderRadius: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 0,
        marginHorizontal: 5
    },
    label:{
        fontSize: 18
    }
})