import React, { useState } from 'react';
import { useTopnavInfo } from '../context/topnav';
import { useNavigate, useParams } from 'react-router';
import { useAgencyInfo } from '../context/agency';
import { useUserInfo } from '../context/user';

const TopNavbar = () => {
    const [
        topnav,
        selctedItems,
        setselctedItems,
        ,
        setselctedItemsType,
        ,
        setselected_category,
    ] = useTopnavInfo();
    const [agency] = useAgencyInfo();
    const [user, , clear] = useUserInfo();
    const navigate = useNavigate();
    const { agency_id } = useParams();

    const [menuOpen, setMenuOpen] = useState(false);

    let middleware = '/';
    if (agency_id) {
        middleware = `/app/${agency_id}/`;
    }

    const handleTagsFilter = (item, type) => {
        if (type === 'category') {
            setselected_category(item);
            const filter_data = topnav?.sub_categories?.filter(
                (sub_category) => sub_category?.category?._id === item?._id
            );
            setselctedItems(filter_data);
        } else {
            setselctedItems([item]);
            setselected_category(item);
        }
        setselctedItemsType('category');
        setMenuOpen(false); // close mobile menu after selection
    };

    return (
        <nav className="bg-black text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <button
                    className="md:hidden text-sm underline"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? 'Close' : 'Menu'}
                </button>

                <ul className="hidden md:flex gap-6 uppercase text-sm font-medium">
                    {topnav?.categories?.map((category) => {
                        const subCategories = topnav?.sub_categories?.filter(
                            (item) => item.category._id === category._id
                        );

                        return (
                            <li key={category._id} className="relative group cursor-pointer">
                                <span
                                    onClick={() => {
                                        handleTagsFilter(category, 'category');
                                        navigate(`${middleware}filter-business/${category._id}`);
                                    }}
                                    className="hover:text-gray-300"
                                >
                                    {category.name}
                                </span>

                                {subCategories.length > 0 && (
                                    <div className="absolute top-full left-0 mt-1 w-48 bg-white text-black rounded-md shadow-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <ul>
                                            {subCategories.map((sub_category) => (
                                                <li
                                                    key={sub_category._id}
                                                    onClick={() => {
                                                        handleTagsFilter(sub_category, 'sub_category');
                                                        navigate(`${middleware}filter-business/${sub_category._id}`);
                                                    }}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    {sub_category.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <ul className="md:hidden mt-4 flex flex-col gap-4 uppercase text-sm font-medium">
                    {topnav?.categories?.map((category) => {
                        const subCategories = topnav?.sub_categories?.filter(
                            (item) => item.category._id === category._id
                        );

                        return (
                            <li key={category._id}>
                                <div
                                    onClick={() => {
                                        handleTagsFilter(category, 'category');
                                        navigate(`${middleware}filter-business/${category._id}`);
                                    }}
                                    className="cursor-pointer hover:text-gray-400"
                                >
                                    {category.name}
                                </div>

                                {subCategories.length > 0 && (
                                    <ul className="ml-4 mt-1 text-gray-300 text-sm">
                                        {subCategories.map((sub_category) => (
                                            <li
                                                key={sub_category._id}
                                                onClick={() => {
                                                    handleTagsFilter(sub_category, 'sub_category');
                                                    navigate(`${middleware}filter-business/${sub_category._id}`);
                                                }}
                                                className="py-1 cursor-pointer hover:text-white"
                                            >
                                                {sub_category.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </nav>
    );
};

export default TopNavbar;
