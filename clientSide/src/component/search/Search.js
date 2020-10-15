import React, { useContext } from 'react';
import 'antd/dist/antd.css';
import { Input } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import Context from '../Context';

function Search() {

    const { Search } = Input;
    const { setUserSearch } = useContext(Context);

    const suffix = (
        <AudioOutlined
            style={{
                fontSize: 16,
                color: '#1890ff',
            }}
        />
    );

    return (
        <div>
            <Search
                placeholder="input search text"
                enterButton="Search"
                size="large"
                suffix={suffix}
                onSearch={value => setUserSearch(value)}

            />
        </div>
    )
}
export default Search;


