import {BrowserRouter, Route, Routes} from "react-router-dom";
import Index from "../Common/Index";
import Navbar from "../Common/Navbar";
import Login from "../Forms/Login";
import Register from "../Forms/signup";
import Imagee from "../Common/Image";
import MyRestaurant from "../pages/MyRestaurant";
import Restaurant from "../pages/Restaurant";
import MenuEdit from "../pages/Edit_menu";
import MenuAdd from "../pages/Add_menu";
import AllBlog from "../pages/Allblog";
import AddBlog from "../pages/AddBlog";
import EditRestaurant from "../pages/EditRestaurant";
import AddRestaurant from "../pages/AddRestaurant";
import FeedBlogs from "../pages/FeedBlogs";
import SearchResult from "../pages/SearchResult";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import AddRestaurantImages from "../pages/AddRestaurantImages";
import DeleteRestaurantImages from "../pages/DeleteRestaurantImages";
import FeedManage from "../pages/FeedManage";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />}>
                    <Route index/>
                </Route>
            </Routes>
            <Routes>
                <Route path="/navbar/" element={<Navbar />}>
                    <Route path="login/" element = {<Login />}/>
                    <Route path="register/" element = {<Register />}/>
                    <Route path="profile/" element = {<Profile />}/>
                    <Route path="restaurant/" element = {<MyRestaurant />}/>
                    <Route path="restaurant/:restaurantId/" element={<Restaurant />} />
                    <Route path="restaurant/menu/edit/:menu_id/" element={<MenuEdit />} />
                    <Route path="restaurant/menu/add/" element={<MenuAdd />} />
                    <Route path="restaurant/:restaurantId/blog/all/" element={<AllBlog />} />
                    <Route path="restaurant/:restaurantId/blog/add/" element={<AddBlog />} />
                    <Route path="restaurant/edit/" element={<EditRestaurant />} />
                    <Route path="restaurant/add/" element={<AddRestaurant />} />
                    <Route path="restaurant/feed/" element={<FeedBlogs />} />
                    <Route path="restaurant/search/:searchInput/result/" element={<SearchResult />} />
                    <Route path="profile/edit/" element={<EditProfile />} />
                    <Route path="restaurant/image/add/" element={<AddRestaurantImages />} />
                    <Route path="restaurant/:restaurantId/image/delete/" element={<DeleteRestaurantImages />} />
                    <Route path="restaurant/feed/manage/" element={<FeedManage/>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
export default Router