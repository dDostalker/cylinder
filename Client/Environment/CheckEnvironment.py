import os
from enum import Enum

from loguru import logger

LINUX_WHEREIS_DOCKER = "whereis docker"
COMANND_DOCKER = "coommand -v docker"
LOGFILE = "./../Log/CheckEnvironment.log"
logger.add(LOGFILE, level="INFO", rotation="1MB")


class EnvironmentState(Enum):
    Uninstall = -1
    Unknow = 0
    Install_With_Path = 1
    Install_Without_Path = 2


def CheckDockerExist() -> str | None:
    logger.info("check Docker Install State")
    docker_stauts = EnvironmentState.Unknow
    check_docker_pipen = os.popen(COMANND_DOCKER)
    check_docker_info = check_docker_pipen.read()
    if True:  # Todo
        pass
    else:
        pass
