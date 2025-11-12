import os
import  re
from enum import Enum

from loguru import logger

COMANND_DOCKER = "command -v docker"
COMANND_VERSION = " --version"
LOGFILE = "./../Log/CheckEnvironment.log"
DOCKER_FILE_CHECK = r"Docker version (\d+).(\d+).(\d+), build (\w+)"
logger.add(LOGFILE, level="INFO", rotation="1MB")


class EnvironmentState(Enum):
    Uninstall = -1
    Unknow = 0
    Install = 1
    Exist = 2
    RightDocker = 4

def CheckDockerExist() -> str | None:
    logger.info("check Docker Install State")
    docker_stauts = EnvironmentState.Unknow.value
    check_docker_pipen = os.popen(COMANND_DOCKER)
    docker_path = check_docker_pipen.read()
    docker_path = docker_path.replace("\n","")
    if docker_path:  
        logger.info(f"Get docker path {docker_path}")
        docker_stauts = EnvironmentState.Install.value
    else:
        logger.warning("Can't find docker")
        docker_stauts = EnvironmentState.Uninstall.value
    if docker_stauts > 0 and os.path.exists(docker_path):
        docker_stauts += EnvironmentState.Exist.value
    # Todo when docker_stauts eq -1 chaeck,maybe not save in path    
    if docker_stauts > 0:
        check_docker_command_pipen = os.popen(f"{docker_path} {COMANND_VERSION}")
        docker_version = check_docker_command_pipen.read()
        logger.info(f"docker version return is {docker_version}")
        version_info = re.fullmatch(DOCKER_FILE_CHECK,docker_version)
        if docker_version:
           docker_stauts += EnvironmentState.RightDocker.value
        else:
            docker_stauts = EnvironmentState.Uninstall.value
    if docker_stauts > 7:
        return docker_path
    else:
        return None

if __name__ == '__main__':
    CheckDockerExist()
