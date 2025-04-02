import { useState } from "react";
import ModalWindow from "../ModalWindow/ModalWindow";
import "./home.css";
import War from "../War/War";

const Home = () => {
  const [modalWindowActive, setModalWindowActive]=useState(false)
  const [modalText, setModalText] = useState('')
const btnWarHandler =()=>{
  setModalText(<War/>)
  setModalWindowActive(true);
}
const btnStolknovenieHandler =()=>{
  setModalText(<War/>)
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
                    <a className="hex-content" href="/cabinet">
                      <span className="hex-content-inner">
                        <span className="icon">
                          <i className="fa fa-bullseye" />
                        </span>
                        <button className="title btnMenu"
                        onClick={btnStolknovenieHandler}
                        >СТОЛКНОВЕНИЕ МИРОВ</button>
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
                        <span className="title">ПАЧКИ АСГАРДА</span>
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
                        <span className="title">ПОКА НИЧЕГО</span>
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
                          <i className="fa fa-life-ring" />
                        </span>
                        <span className="title">ПОХЕР ЧТО</span>
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
                    <a className="hex-content" href="#">
                      <span className="hex-content-inner">
                        <span className="icon">
                          <i className="fa fa-clipboard" />
                        </span>
                        <span className="title">ПОХЕР КАК</span>
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
                    <a className="hex-content" href="#">
                      <span className="hex-content-inner">
                        <span className="icon">
                          <i className="fa fa-map-signs" />
                        </span>
                        <span className="title"> ПОХЕР ЗА ЧТО</span>
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
