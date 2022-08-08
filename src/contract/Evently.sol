// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Evently {
    uint private eventsLength = 0;
    address internal cUsdTokenAddress =
        0x686c626E48bfC5DC98a30a9992897766fed4Abd3;

    struct Event {
        address payable owner;
        string image;
        string theme;
        uint date;
        string location;
        uint follow;
        uint price;
        bool sale;
        mapping(address => bool) hasFollowed;
    }

    mapping(uint => Event) internal events;
    mapping(uint => bool) private exists;

    modifier checkPrice(uint _price) {
        require(_price > 0, "Price needs to be at least one wei");
        _;
    }

    modifier checkStatus(uint _index) {
        require(events[_index].sale, "Not on sale");
        _;
    }

    modifier exist(uint _index) {
        require(exists[_index], "Query of nonexistent event");
        _;
    }

    function getEvent(uint _index)
        public
        view
        returns (
            address payable owner,
            string memory image,
            string memory theme,
            uint date,
            string memory location,
            uint follow,
            uint price,
            bool sale
        )
    {
        owner = events[_index].owner;
        image = events[_index].image;
        theme = events[_index].theme;
        date = events[_index].date;
        location = events[_index].location;
        follow = events[_index].follow;
        price = events[_index].price;
        sale = events[_index].sale;
    }

    /// @dev allows users to create an event
    function createEvent(
        string calldata _image,
        string calldata _theme,
        uint _date,
        string calldata _location,
        uint _price
    ) external checkPrice(_price) {
        require(_date > block.timestamp, "Invalid date");
        require(bytes(_image).length > 0, "Empty image url");
        require(bytes(_theme).length > 0, "Empty theme");
        require(bytes(_location).length > 0, "Empty location");

        Event storage Evento = events[eventsLength];
        exists[eventsLength] = true;
        eventsLength++;
        Evento.owner = payable(msg.sender);
        Evento.image = _image;
        Evento.theme = _theme;
        Evento.date = _date;
        Evento.location = _location;
        Evento.price = _price;
        Evento.sale = true;
    }

    /// @dev allows users to buy an event
    function buyEvent(uint _index)
        public
        payable
        exist(_index)
        checkStatus(_index)
    {
        require(events[_index].owner != msg.sender, "Owners can't buy tickets");
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                events[_index].owner,
                events[_index].price
            ),
            "Transfer failed."
        );

        events[_index].owner = payable(msg.sender);
        events[_index].sale = false;
    }

    /// @dev allows users to put an event back on sale or out of sale
    function toggleSale(uint _index) public exist(_index) {
        require(events[_index].owner == msg.sender, "Owners can't buy tickets");
        events[_index].sale = !events[_index].sale;
    }

    function changePrice(uint _index, uint _price)
        public
        exist(_index)
        checkPrice(_price)
        checkStatus(_index)
    {
        require(events[_index].owner == msg.sender, "Owners can't buy tickets");
        events[_index].sale = !events[_index].sale;
    }

    function followEvent(uint _index) public exist(_index) {
        require(
            events[_index].hasFollowed[msg.sender] == false,
            "User can follow the event only once"
        );
        events[_index].follow++;
        events[_index].hasFollowed[msg.sender] = true;
    }

    function unfollowEvent(uint _index) public exist(_index) {
        require(
            events[_index].hasFollowed[msg.sender],
            "User isn't following this event"
        );
        events[_index].follow--;
        events[_index].hasFollowed[msg.sender] = false;
    }


    function getEventsLength() public view returns (uint) {
      return eventsLength;
    }
}
