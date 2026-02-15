import {Route, Routes } from "react-router-dom";
import Home from "./pages/MainPage/Home";
import Signup from "./pages/Login/Signup";
import Layout from "./layouts/Layout";
import LocalSignup from "./pages/Login/LocalSignup";

const App = () => {
    return(

            <Routes>

                    {/* Layout 적용되는 페이지 */}
                    <Route element={<Layout/>}>
                        <Route path="/" element={<Home />}/>
                    </Route>

                    {/* Layout 적용되지 않는 페이지 */}
                    <Route path="/Signup" element={<Signup />}/>
                    <Route path="/LocalSignup" element={<LocalSignup/>}/>
            </Routes>

    );
}

export default App;