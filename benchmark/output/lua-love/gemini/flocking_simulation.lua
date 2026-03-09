[i]*boid_vxs[i] + boid_vys[i]*boid_vys[i])
        if speed > 150.0 then
            boid_vxs[i] = (boid_vxs[i] / speed) * 150.0
            boid_vys[i]