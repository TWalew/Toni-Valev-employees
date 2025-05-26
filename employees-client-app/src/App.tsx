import React, { createContext } from "react";

import { Layout } from "./components/Layout/Layout";
import { GlobalStore } from "./stores/Global";

import "./App.scss";

type IAppContext = {
	store: GlobalStore;
};

export const GlobalContext = createContext<IAppContext>({
	store: new GlobalStore(),
});

const App = () => (
	<GlobalContext.Provider value={{ store: new GlobalStore() }}>
		<Layout />
	</GlobalContext.Provider>
);

export default App;
