import { StyleSheet, Text, View, Image } from 'react-native'
import { useFonts } from 'expo-font'

export default function Logo({ImagemEstilo, textoEstilo, cor}){
    const [fontsLoaded, fontError] = useFonts({
        'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
      });
      if(!fontsLoaded){
        return null
      }
    return (
            
            <View style={styles.espacamento}>
                <Image source={require('../../assets/images/axolote_png.png')} style={[styles.logoImage, ImagemEstilo]}></Image>
              <Text style={[styles.logoText, textoEstilo]}>Lógica</Text><Text style={[styles.logoText, textoEstilo, {color: cor}]}>++</Text>
            </View>
    )
}

const styles = StyleSheet.create({
    espacamento:{
        flexDirection: 'row',
        gap: 5,
    },
    logoText:{
        fontFamily: 'Quicksand-Bold',
        fontSize: 30,
        color: '373737'
    },
    logoImage: {
        width: 55,
        height: 44,
    },
})