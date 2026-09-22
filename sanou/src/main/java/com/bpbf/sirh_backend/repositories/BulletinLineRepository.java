package com.bpbf.sirh_backend.repositories;

import com.bpbf.sirh_backend.entities.BulletinLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BulletinLineRepository extends JpaRepository<BulletinLine, Long> {

    List<BulletinLine> findByBulletinIdOrderByOrdreAscIdAsc(Long bulletinId);

    void deleteByBulletinId(Long bulletinId);
}
