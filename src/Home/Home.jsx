import { useState } from "react";
import ModalWindow from "../ModalWindow/ModalWindow";
import "./home.css";
import War from "../War/War";
import Sm from "../Sm/Sm";
import Asgard from '../Asgard/Asgard'
import Territory from '../Territory/Territory'
import Activ from "../Activ/Activ";
import Nakazanie from "../Nakazanie/Nakazanie";
import Hrefs from "../Hrefs/Hrefs";

const Home = () => {
  const [modalWindowActive, setModalWindowActive]=useState(false)
  const [modalText, setModalText] = useState('')
const btnWarHandler =()=>{
  setModalText(<War/>)
  setModalWindowActive(true);
}
const btnStolknovenieHandler =()=>{
  setModalText(<Sm/>)
  setModalWindowActive(true);
}
const btnAsgard =()=>{
  setModalText(<Asgard/>)
  setModalWindowActive(true);
}
const btnTerritory =()=>{
  setModalText(<Territory/>)
  setModalWindowActive(true);
}
const btnActiv =()=>{
  setModalText(<Activ/>)
  setModalWindowActive(true);
}
const btnNakazanie =()=>{
  setModalText(<Nakazanie/>)
  setModalWindowActive(true);
}
const btnHrefs =()=>{
  setModalText(<Hrefs/>)
  setModalWindowActive(true);
}
  return (
    <main className="site-wrapper">
      <div className="pt-table desktop-768">
        <div className="pt-tablecell page-home relative">
          <div className="overlay" />
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-offset-1 col-md-10 col-lg-offset-2 col-lg-8">
                <div className="page-title  home text-center">
                  <span className="heading-page"></span>
                  <p className="mt20" />
                </div>

                <div className="hexagon-menu clear">
                  <div className="hexagon-item">
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <a className="hex-content">
                      <span className="hex-content-inner">
                        <span className="icon">
                          <i className="fa fa-universal-access" />
                        </span>
                        <button className="title btnMenu"
                        onClick={btnWarHandler}
                        >ВОЙНА</button>
                      </span>
                      <svg
                        viewBox="0 0 173.20508075688772 200"
                        height="200"
                        width="174"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z"
                          fill="#1e2530"
                        />
                      </svg>
                    </a>
                  </div>

                  <div className="hexagon-item">
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <a className="hex-content">
                      <span className="hex-content-inner">
                        <span className="icon">
                          <i className="fa fa-bullseye" />
                        </span>
                        <button className="title btnMenu"
                        onClick={btnStolknovenieHandler}
                        >СМ</button>
                      </span>
                      <svg
                        viewBox="0 0 173.20508075688772 200"
                        height="200"
                        width="174"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z"
                          fill="#1e2530"
                        />
                      </svg>
                    </a>
                  </div>

                  <div className="hexagon-item">
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <a className="hex-content">
                      <span className="hex-content-inner">
                        <span className="icon">
                          <i className="fa fa-braille" />
                        </span>
                        <button className="title btnMenu"
                        onClick={btnAsgard}
                        >АСГАРД</button>
                      </span>
                      <svg
                        viewBox="0 0 173.20508075688772 200"
                        height="200"
                        width="174"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z"
                          fill="#1e2530"
                        />
                      </svg>
                    </a>
                  </div>

                  <div className="hexagon-item">
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <a className="hex-content">
                      <span className="hex-content-inner">
                        <span className="icon">
                          <i className="fa fa-id-badge" />
                        </span>
                        <button className="title btnMenu"
                        onClick={btnTerritory}
                        >Территория завоеваний</button>                      </span>
                      <svg
                        viewBox="0 0 173.20508075688772 200"
                        height="200"
                        width="174"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z"
                          fill="#1e2530"
                        />
                      </svg>
                    </a>
                  </div>

                  <div className="hexagon-item">
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <a className="hex-content">
                      <span className="hex-content-inner">
                        <span className="icon">
                          <i className="fa fa-life-ring" />
                        </span>
                        <button className="title btnMenu"
                        onClick={btnActiv}
                        >АКТИВНОСТЬ</button>                      </span>
                      <svg
                        viewBox="0 0 173.20508075688772 200"
                        height="200"
                        width="174"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z"
                          fill="#1e2530"
                        />
                      </svg>
                    </a>
                  </div>

                  <div className="hexagon-item">
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <a className="hex-content">
                      <span className="hex-content-inner">
                        <span className="icon">
                          <i className="fa fa-clipboard" />
                        </span>
                        <button className="title btnMenu"
                        onClick={btnNakazanie}
                        >НАКАЗАНИЯ</button>                      </span>
                      <svg
                        viewBox="0 0 173.20508075688772 200"
                        height="200"
                        width="174"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z"
                          fill="#1e2530"
                        />
                      </svg>
                    </a>
                  </div>

                  <div className="hexagon-item">
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <div className="hex-item">
                      <div />
                      <div />
                      <div />
                    </div>
                    <a className="hex-content" >
                      <span className="hex-content-inner">
                        <span className="icon">
                          <i className="fa fa-map-signs" />
                        </span>
                        <button className="title btnMenu"
                        onClick={btnHrefs}
                        >Подбор пачек</button>                        </span>
                      <svg
                        viewBox="0 0 173.20508075688772 200"
                        height="200"
                        width="174"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M86.60254037844386 0L173.20508075688772 50L173.20508075688772 150L86.60254037844386 200L0 150L0 50Z"
                          fill="#1e2530"
                        />
                      </svg>
                    </a>
                  </div>


                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalWindow
      modalWindowActive={modalWindowActive}
      setModalWindowActive={setModalWindowActive}
      modalText={modalText}
      />
    </main>
  );
};
export default Home;
