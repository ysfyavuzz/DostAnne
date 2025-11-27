import React, { useRef, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Asset } from 'expo-asset';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
    onFinish: () => void;
}

export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onFinish }) => {
    const videoRef = useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        setStatus(status);
        if (status.isLoaded && status.didJustFinish) {
            onFinish();
        }
    };

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                style={styles.video}
                source={require('../../assets/images/splash-video.mp4')}
                resizeMode={ResizeMode.COVER}
                shouldPlay={true}
                isLooping={false}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: width,
        height: height,
    },
});
