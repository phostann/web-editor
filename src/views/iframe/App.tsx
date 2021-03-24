import React, {createContext, useContext} from 'react';
import Container from "./components/Container";
import {Store} from "./store/Store";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import CustomDragLayer from "./components/CustomDragLayer";

const StoreContext = createContext<Store | null>(null);

export const useStore = () => {
    return useContext(StoreContext)!!;
}

function App() {


    return <StoreContext.Provider value={new Store()}>
        <DndProvider backend={HTML5Backend}>
            <Container/>
            <CustomDragLayer/>
        </DndProvider>
    </StoreContext.Provider>
}

export default App;
