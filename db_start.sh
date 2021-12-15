#!/bin/bash

print_col() {
    tput bold
    tput setaf $1
    echo $2
    tput sgr0
}

docker-compose down --remove-orphans && docker volume rm apidynafood_db_data
print_col 2 "BUILDING DB ... => "
docker-compose -f docker-compose.db.yaml up
exit