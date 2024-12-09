import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import "./index.css";

const ScreenShareClient = () => {
  const videoRef = useRef(null);
  const socket = useRef(null);
  const peerConnection = useRef(null);
  const dialogRef = useRef(null); // Referência para o dialog
  const [isDialogOpen, setIsDialogOpen] = useState(true); // Dialog aberto por padrão
  const [currentStep, setCurrentStep] = useState(1); // Estado para controlar a etapa
  const [showMessageAgain, setShowMessageAgain] = useState(false); // Estado para o checkbox
  const [isNextDisabled, setIsNextDisabled] = useState(false); // Controle de desabilitar o botão "Próximo"

  useEffect(() => {
    // Verifica no localStorage se o usuário escolheu não mostrar novamente
    const storedPreference = localStorage.getItem("showDialogAgain");
    if (storedPreference === "false") {
      setIsDialogOpen(false); // Fecha o dialog se o valor for 'false'
    } else {
      setShowMessageAgain(true); // Caso contrário, o checkbox é marcado por padrão
    }

    const socketURL = `${window.location.protocol}//${window.location.hostname}:5000`;
    socket.current = io(socketURL);

    // Configuração WebRTC
    peerConnection.current = new RTCPeerConnection();

    // Receber stream de vídeo e áudio e exibir
    peerConnection.current.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    // Receber oferta do emissor
    socket.current.on("webrtc-offer", async (offer) => {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.current.emit(
        "webrtc-answer",
        peerConnection.current.localDescription
      );
    });

    // Adicionar candidatos ICE recebidos
    socket.current.on("webrtc-candidate", async (candidate) => {
      await peerConnection.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    });

    return () => {
      socket.current.disconnect();
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, []);

  // Função para fechar o dialog
  const closeDialog = () => {
    setIsDialogOpen(false); // Fecha o dialog
  };

  // Função para ir para o próximo passo
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
    // Desabilita o botão Próximo se for a última etapa e o checkbox estiver marcado
    if (currentStep === 3 && showMessageAgain) {
      setIsNextDisabled(true);
    }
  };

  // Função para ir para o passo anterior
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    // Habilita novamente o botão "Próximo" se o checkbox foi desmarcado
    if (currentStep === 2 && !showMessageAgain) {
      setIsNextDisabled(false);
    }
  };

  // Função para manipular o checkbox
  const handleCheckboxChange = (e) => {
    setShowMessageAgain(e.target.checked);
    // Se o checkbox for marcado na última etapa, desabilita o botão de próximo
    if (currentStep === 3 && e.target.checked) {
      setIsNextDisabled(true);
    }
    // Salva a escolha no localStorage
    localStorage.setItem(
      "showDialogAgain",
      e.target.checked ? "true" : "false"
    );

    // Se o checkbox for desmarcado, fecha o modal imediatamente
    if (!e.target.checked) {
      setIsDialogOpen(false);
    }
  };

  // Conteúdo dinâmico com base na etapa
  const renderDialogContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h4>
              Antes de iniciar o espelhamento, é importante que o cliente esteja
              aberto.
            </h4>
          </>
        );
      case 2:
        return (
          <>
            <h4>
              Agora, ligue o servidor e acesse{"  "}
              <a
                href="http://localhost:5000/server"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>localhost:5000/server</strong>
              </a>
            </h4>
          </>
        );
      case 3:
        return (
          <>
            <h4>
              Deseja que esta mensagem seja exibida novamente ao atualizar a
              página?
            </h4>
            <label style={{ cursor: "pointer" }}>
              <input
                style={{ cursor: "pointer" }}
                type="checkbox"
                checked={showMessageAgain}
                onChange={handleCheckboxChange}
              />
              Mostrar novamente
            </label>
            <button onClick={closeDialog} className="btn-close">
              Fechar
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {isDialogOpen && (
        <>
          <div className="backdrop"></div>

          <dialog ref={dialogRef} className="Dialog" open>
            {renderDialogContent()}

            <div className="dialog-buttons">
              <button
                className="btn-a"
                onClick={previousStep}
                disabled={currentStep === 1}
              >
                Anterior
              </button>

              <button
                className="btn-a"
                onClick={nextStep}
                disabled={isNextDisabled || currentStep === 3}
              >
                Próximo
              </button>
            </div>
          </dialog>
        </>
      )}

      <video ref={videoRef} autoPlay controls style={{ width: "100%" }} />
    </div>
  );
};

export default ScreenShareClient;
