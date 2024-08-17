# Prog_Lab_2024_Group_1
This is the Github Page for the Pizza Website for the Modul Programming Lab, Group 1

This project involves frontend programming using HTML, CSS, and JavaScript, and backend development using SQL and PHP. The database server is hosted using Docker. The project focuses on programming and analyzing the presented database from the perspective of the store's profitability.


<!-- DB Server Connection:
Server Connection SSH
login: root
password: hrR&#3dAiiGFSv

64.226.100.141/phpmyadmin
DB login
root: admin
password: 0298753482ecbcc3be9d529b3df5d806b9da61cf727e51eb -->

### Docker Container installation guide

#### Prerequisite 
- install [Docker](https://www.docker.com/products/docker-desktop/)
- Download this GitHub repository either by:
    - using git the terminal with `git clone https://github.com/Ansonini/Prog_Lab_2024_Group_1` (git needs to be installed)
    - Downloading the .zip from GitHub directly by clicking on the green `<>Code` -> `Download Zip` 

#### Preparation
- extract .zip where you want
- Navigate to  the folder `Prog_Lab_2024_Group_1\build\mysql\sql_conf`
- Right click file `mysql.cnf` and select properties
- enable the Attribute `Read only` (german `Schreibgeschütz`) and click ok
- the mysql container will be connected to the port 3307 of the host machine, make sure it isn't occupied (Default is 3306 so it's unlikely)
- the php apache server will be connected to the localhost under the port 8080
- You can change the connected ports by opening docker-compose.yml and change the number on the left under mysql > ports: "3307:3306" and php-apache > ports: "8080:80"

#### Docker 
- Navigate back to the `Prog_Lab_2024_Group_1` Folder 
- Right click an emptly area of the  window and select `Open in terminal` (if it isn't in the first right click menu, click `show more options`)
- in the terminal window type `docker-compose up`
- wait for it to finish, it will take a while 
- when its done the website [localhost:8080](http://localhost:8080/) should display the site
- all the files for the website are located in the `Prog_Lab_2024_Group_1/app` folder 

#### How to stop/start the Server after that
- Open Docker desktop and go to Containers in the sidebar 
- Find the `prog_lab_2024_group_1` container and click play/stop on the right

