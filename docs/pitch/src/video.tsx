import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Deck} from './Deck';
import {durationInFrames,FPS} from './content';
registerRoot(()=> <Composition id="TracePitch" component={Deck} durationInFrames={durationInFrames} fps={FPS} width={1920} height={1080}/>);
