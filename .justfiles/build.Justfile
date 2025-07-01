# Start the local instance
[group("Build")]
extract-php tag:
	docker compose exec php bash -c <<- DELIMITER
		rm -rf extract \
		mkdir extract \
		git archive --prefix=\"./\" --format=tar {{tag}} .| tar xv -C extract/ \
		find extract/ -type f -exec sed -i \"s/%release-tag%/:{{tag}}/\" {} \; \
		cd extract \
		composer install --no-dev --prefer-dist -a \
		cd .. \
		tar cvzf archive.tgz -C extract/ . \
		rm -rf extract \
	DELIMITER
