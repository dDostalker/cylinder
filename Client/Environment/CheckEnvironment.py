import os
import re
from dataclasses import dataclass
from enum import Enum

import psutil
from loguru import logger

COMANND_DOCKER = "command -v docker"
COMANND_VERSION = " --version"
LOGFILE = "./../Log/CheckEnvironment.log"
DOCKER_FILE_CHECK = r"Docker version (\d+).(\d+).(\d+), build (\w+)"
logger.add(LOGFILE, level="INFO", rotation="1MB")


class EnvironmentState(Enum):
    """
    Check command exist flag
    """

    Uninstall = -1
    Unknow = 0
    Install = 1
    Exist = 2
    RightDocker = 4


@dataclass
class PhysicalMachineInfo:
    cpu_count: int | None
    memory_total: int | None
    memory_used: int | None
    os: str | None
    # todo


def CheckDockerExist() -> str | None:
    """
    Check if Docker is installed and return its path if found.
    Returns:
        str | None: The path to the Docker executable if found, otherwise None.
    """
    logger.info("Start Check Docker Install State")

    docker_stauts = EnvironmentState.Unknow.value
    check_docker_pipen = os.popen(COMANND_DOCKER)
    docker_path = check_docker_pipen.read()
    docker_path = docker_path.replace("\n", "")

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
        version_info = re.fullmatch(DOCKER_FILE_CHECK, docker_version)
        if version_info:
            docker_stauts += EnvironmentState.RightDocker.value
        else:
            docker_stauts = EnvironmentState.Uninstall.value

    if docker_stauts > 7:
        return docker_path
    else:
        return None


def GetPhysicalMachineInfo() -> PhysicalMachineInfo | None:
    """
    Get  information from physical machine
    Returns:
        PhysicalMachineInfo | None: The physical machine information if get success, otherwise None.
    """
    logger.info("Start check system info")

    try:
        cpu_count = psutil.cpu_count()
        logger.info(f"Get cpu count {cpu_count}")
        memory_info = psutil.virtual_memory()
        logger.info(f"Get memory info {memory_info}")
        os = None  # todo
        logger.info(f"Get os info {os}")
        return PhysicalMachineInfo(cpu_count, memory_info.total, memory_info.used, os)
    except Exception as e:
        logger.error(f"Get physical machine info error: {e}")
        return None


def test_DockerExist():
    CheckDockerExist()


def test_physicalMachineInfo():
    phy_machine_info = GetPhysicalMachineInfo()
    assert phy_machine_info is not None, "Get physical machine info failed"
    assert phy_machine_info.cpu_count is not None, "CPU count should be greater than 0"
    assert phy_machine_info.memory_total is not None, (
        "Memory total should be greater than 0"
    )
    assert phy_machine_info.memory_used is not None, (
        "Memory used should be greater than 0"
    )
    # assert phy_machine_info.os is not None, "OS should not be None"
