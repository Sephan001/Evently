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
contract Evently{
     uint internal eventsLength = 0;
      address internal cUsdTokenAddress =   0x686c626E48bfC5DC98a30a9992897766fed4Abd3;

      
       struct Eventt{
           address payable owner;
           string image;
           string theme;
            string date;
            string location;
            uint follow;
            uint price;

            mapping(address => bool) hasFollowed;
       }

            mapping (uint =>  Eventt) internal events;

        function getEvent(uint _index) public view returns (
        address payable,
        string memory,
        string memory,
        string memory,
        string memory,
        uint,
        uint
     


         ) {
        return (  
            events[_index].owner,
             events[_index].image,
              events[_index].theme,
               events[_index].date,
                events[_index].location,
                 events[_index].follow,
                  events[_index].price
               
        );
       
    }
 
      function  createEvent(
        string memory _image, 
        string memory _theme,
        string memory _date,
        string memory _location,
        uint _price

          ) public {
       Eventt storage Evento = events[eventsLength];


          Evento.owner = payable(msg.sender);
       Evento.image = _image;
           Evento.theme = _theme;
            Evento.date = _date;
            Evento.location= _location;
             Evento.price = _price;

  
        eventsLength++;
          }


    
   
               function buyTicket(uint _index) public payable  {
        require(
          IERC20Token(cUsdTokenAddress).transferFrom(
            msg.sender,
            events[_index].owner,
            events[_index].price
          ),
          "Transfer failed."
        );

         events[_index].owner = payable(msg.sender);
         
    }

       function followEvent(uint _index)public{
        require(events[_index].hasFollowed[msg.sender] == false, "User can follow the event only once");
        events[_index].follow++;
        events[_index].hasFollowed[msg.sender] = true;
    } 

}